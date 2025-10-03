package com.tryon.service;

import com.tryon.dto.ProductResponse;
import com.tryon.dto.TryOnJobResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for managing virtual try-on processing jobs using Gemini API
 *
 * This service handles:
 * - Async job submission to Gemini API for virtual try-on
 * - Job state management (QUEUED -> RUNNING -> SUCCEEDED/FAILED)
 * - Integration with PromptGeneratorService for optimized prompts
 * - Automatic prompt generation based on product details
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TryOnService {

    private final ImageStorageService imageStorageService;
    private final ProductService productService;
    private final GeminiImageService geminiImageService;
    private final PromptGeneratorService promptGeneratorService;

    @Value("${tryon.service.timeout}")
    private int timeoutSeconds;

    // In-memory job storage for prototype - replace with database in production
    private final Map<String, TryOnJobResponse> jobs = new ConcurrentHashMap<>();

    /**
     * Submit a try-on job with product ID and user image (NEW SIMPLIFIED FLOW)
     * No user prompt required - automatically generates optimal prompt
     */
    public TryOnJobResponse submitTryOnJob(String productId, MultipartFile userImage) throws IOException {
        log.info("Starting try-on job for product: {}", productId);
        
        // Validate that product exists
        Optional<ProductResponse> productOpt = productService.getProductById(productId);
        if (productOpt.isEmpty()) {
            throw new IllegalArgumentException("Product not found: " + productId);
        }

        ProductResponse product = productOpt.get();
        
        // Generate automatic prompt based on product details
        String autoPrompt = generateAutoPrompt(product);
        log.info("Generated automatic prompt for product {}: {}", productId, autoPrompt);

        return createAndProcessJob(productId, null, userImage, autoPrompt);
    }

    /**
     * Submit a try-on job with new product image and user image
     */
    public TryOnJobResponse submitTryOnJob(MultipartFile productImage, MultipartFile userImage, String productName, String category) throws IOException {
        log.info("Starting try-on job with uploaded product image: {}", productName);
        
        // Generate prompt for uploaded product
        String autoPrompt = promptGeneratorService.generateOptimizedPrompt(productName, category);
        log.info("Generated prompt for uploaded product: {}", autoPrompt);

        return createAndProcessJob(null, productImage, userImage, autoPrompt);
    }

    /**
     * Get job status and result
     */
    public TryOnJobResponse getJobStatus(String jobId) {
        TryOnJobResponse job = jobs.get(jobId);
        if (job == null) {
            throw new IllegalArgumentException("Job not found: " + jobId);
        }
        return job;
    }

    /**
     * Get all jobs (for monitoring/debugging)
     */
    public Map<String, TryOnJobResponse> getAllJobs() {
        return Map.copyOf(jobs);
    }

    /**
     * Generate automatic prompt based on product details
     */
    private String generateAutoPrompt(ProductResponse product) {
        // Determine if this is kids, formal wear, or regular clothing
        String category = product.getCategory().toLowerCase();
        String description = product.getDescription() != null ? product.getDescription().toLowerCase() : "";
        
        // Check for kids clothing
        if (category.contains("kids") || category.contains("child") || 
            description.contains("kids") || description.contains("children")) {
            return promptGeneratorService.generateKidsPrompt(product.getName(), product.getCategory());
        }
        
        // Check for formal wear
        if (category.contains("formal") || category.contains("suit") || category.contains("dress shirt") ||
            category.contains("blazer") || description.contains("formal") || description.contains("business")) {
            return promptGeneratorService.generateFormalWearPrompt(product.getName(), product.getCategory());
        }
        
        // For regular clothing, use the comprehensive prompt
        String[] sizes = product.getSizes() != null ? product.getSizes().toArray(new String[0]) : new String[]{"M", "L"};
        String[] colors = product.getColors() != null ? product.getColors().toArray(new String[0]) : new String[]{"Default"};
        
        // Determine gender from category or use unisex
        String gender = determineGender(product.getCategory(), product.getDescription());
        
        return promptGeneratorService.generateVirtualTryOnPrompt(
            product.getName(), 
            product.getCategory(), 
            product.getDescription(), 
            gender, 
            sizes, 
            colors
        );
    }

    /**
     * Determine gender from product category and description
     */
    private String determineGender(String category, String description) {
        if (category == null) category = "";
        if (description == null) description = "";
        
        String combined = (category + " " + description).toLowerCase();
        
        if (combined.contains("women") || combined.contains("ladies") || combined.contains("female")) {
            return "women";
        } else if (combined.contains("men") || combined.contains("male") || combined.contains("gentleman")) {
            return "men";
        } else if (combined.contains("kids") || combined.contains("children") || combined.contains("child")) {
            return "kids";
        } else {
            return "unisex";
        }
    }

    /**
     * Create job and start async processing
     */
    private TryOnJobResponse createAndProcessJob(String productId, MultipartFile productImage,
                                               MultipartFile userImage, String prompt) throws IOException {
        String jobId = "job-" + UUID.randomUUID().toString();

        log.info("Creating try-on job {} for product: {}", jobId, productId != null ? productId : "uploaded");

        // Store user image
        String userImagePath = imageStorageService.storeUserImage(userImage);
        log.info("Stored user image for job {}: {}", jobId, userImagePath);

        // Store product image if provided
        String productImagePath = null;
        if (productImage != null) {
            productImagePath = imageStorageService.storeProductImage(productImage, jobId);
            log.info("Stored product image for job {}: {}", jobId, productImagePath);
        }

        // Create initial job response
        TryOnJobResponse job = TryOnJobResponse.builder()
                .jobId(jobId)
                .status(TryOnJobResponse.JobStatus.QUEUED)
                .sourceProductId(productId)
                .prompt(prompt)
                .createdAt(LocalDateTime.now())
                .estimatedProcessingTimeSeconds(timeoutSeconds)
                .build();

        jobs.put(jobId, job);
        log.info("Created try-on job: {} with status: {}", jobId, job.getStatus());

        // Start async processing
        processJobAsync(jobId, productId, productImagePath, userImagePath, prompt);

        return job;
    }

    /**
     * Async job processing - calls Gemini API for virtual try-on
     */
    @Async
    public CompletableFuture<Void> processJobAsync(String jobId, String productId, String productImagePath,
                                                   String userImagePath, String prompt) {
        try {
            log.info("Starting async processing for job: {}", jobId);
            
            // Update job status to RUNNING
            updateJobStatus(jobId, TryOnJobResponse.JobStatus.RUNNING, null, null);

            // Get product image path
            String finalProductImagePath = getProductImagePath(productId, productImagePath);
            
            if (finalProductImagePath == null) {
                throw new RuntimeException("Product image not found");
            }

            log.info("Processing try-on with Gemini API - Job: {}, Product Image: {}, User Image: {}", 
                    jobId, finalProductImagePath, userImagePath);

            // Call Gemini API for virtual try-on
            byte[] resultImageData = geminiImageService.generateVirtualTryOnImage(
                finalProductImagePath, 
                userImagePath, 
                prompt
            );

            // Store result image
            String resultImagePath = imageStorageService.storeResultImage(resultImageData, jobId, "jpg");
            String resultImageUrl = imageStorageService.generatePublicUrl(resultImagePath, "results");

            log.info("Try-on processing completed for job: {}, result URL: {}", jobId, resultImageUrl);

            // Update job status to SUCCEEDED
            updateJobStatus(jobId, TryOnJobResponse.JobStatus.SUCCEEDED, resultImageUrl, null);

        } catch (Exception e) {
            log.error("Failed to process try-on job: {} - {}", jobId, e.getMessage(), e);
            updateJobStatus(jobId, TryOnJobResponse.JobStatus.FAILED, null, e.getMessage());
        }

        return CompletableFuture.completedFuture(null);
    }

    /**
     * Get the correct product image path
     */
    private String getProductImagePath(String productId, String productImagePath) {
        if (productImagePath != null) {
            return productImagePath;
        }
        
        if (productId != null) {
            Optional<ProductResponse> productOpt = productService.getProductById(productId);
            if (productOpt.isPresent()) {
                String imageUrl = productOpt.get().getImageUrl();
                String filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
                
                // Product images are now stored in frontend/public/products/
                // Use absolute path to frontend directory
                String frontendProductsPath = "../frontend/public/products/" + filename;
                
                log.debug("Product image path for ID {}: {}", productId, frontendProductsPath);
                return frontendProductsPath;
            }
        }
        
        return null;
    }

    /**
     * Update job status in memory
     */
    private void updateJobStatus(String jobId, TryOnJobResponse.JobStatus status, String resultImageUrl, String errorMessage) {
        TryOnJobResponse job = jobs.get(jobId);
        if (job != null) {
            TryOnJobResponse updatedJob = TryOnJobResponse.builder()
                    .jobId(job.getJobId())
                    .status(status)
                    .resultImageUrl(resultImageUrl)
                    .sourceProductId(job.getSourceProductId())
                    .prompt(job.getPrompt())
                    .errorMessage(errorMessage)
                    .createdAt(job.getCreatedAt())
                    .completedAt(status == TryOnJobResponse.JobStatus.SUCCEEDED ||
                               status == TryOnJobResponse.JobStatus.FAILED ? LocalDateTime.now() : null)
                    .estimatedProcessingTimeSeconds(job.getEstimatedProcessingTimeSeconds())
                    .build();

            jobs.put(jobId, updatedJob);
            
            log.info("Updated job {} status to: {}", jobId, status);
        }
    }
}
