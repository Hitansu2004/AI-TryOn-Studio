package com.tryon.controller;

import com.tryon.dto.TryOnJobResponse;
import com.tryon.service.TryOnService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * REST Controller for virtual try-on processing
 *
 * This controller handles virtual try-on requests using a specialized external microservice
 * designed for two-image garment transfer (e.g., TryOnDiffusion's Parallel-UNet architecture).
 *
 * The try-on process preserves garment identity, color, and realistic drape by conditioning
 * on both product and person images. Generic text-to-image models are not suitable for
 * accurate garment transfer and should not be used for this endpoint.
 *
 * External microservice requirements:
 * - Accepts multipart requests with product image, user image, and text prompt
 * - Returns generated composite image as byte array
 * - Implements specialized virtual try-on model (not generic image generation)
 */
@RestController
@RequestMapping("/api/tryon")
@RequiredArgsConstructor
@Validated
@Slf4j
@Tag(name = "Virtual Try-On", description = "Virtual try-on processing APIs using specialized garment transfer models")
public class TryOnController {

    private final TryOnService tryOnService;

    @Operation(
        summary = "Submit virtual try-on job",
        description = "Submit a virtual try-on request with either an existing product ID or a new product image upload, " +
                     "plus a user image and text prompt. The request is processed asynchronously by a specialized " +
                     "try-on microservice (e.g., TryOnDiffusion) that preserves garment details and realistic fit. " +
                     "Returns a job ID immediately for status tracking.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Multipart form data with either productId OR productImage file, plus userImage and prompt",
            required = true,
            content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)
        ),
        responses = {
            @ApiResponse(responseCode = "202", description = "Try-on job submitted successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input - missing required fields or invalid files"),
            @ApiResponse(responseCode = "404", description = "Product ID not found"),
            @ApiResponse(responseCode = "413", description = "File size exceeds maximum limit")
        }
    )
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TryOnJobResponse> submitTryOnJob(
            @Parameter(description = "Existing product ID to use (mutually exclusive with productImage)",
                      example = "123e4567-e89b-12d3-a456-426614174000")
            @RequestParam(value = "productId", required = false) String productId,

            @Parameter(description = "New product image file (mutually exclusive with productId). JPEG/PNG, max 10MB")
            @RequestParam(value = "productImage", required = false) MultipartFile productImage,

            @Parameter(description = "User/customer image for try-on. JPEG/PNG, max 10MB", required = true)
            @RequestParam("userImage") MultipartFile userImage,

            @Parameter(description = "Text prompt describing desired try-on result (optional - if empty, automatic prompts will be generated)",
                      required = false,
                      example = "Show the blue jeans on the person with a casual fit")
            @RequestParam(value = "prompt", required = false, defaultValue = "") String prompt
    ) throws IOException {

        // Validate that either productId or productImage is provided (but not both)
        if ((productId == null && productImage == null) || (productId != null && productImage != null)) {
            throw new IllegalArgumentException(
                "Either productId or productImage must be provided (but not both)"
            );
        }

        // Validate required fields
        if (userImage == null || userImage.isEmpty()) {
            throw new IllegalArgumentException("userImage is required");
        }

        // Note: prompt is now optional - if empty, automatic prompts will be generated

        TryOnJobResponse job;
        if (productId != null) {
            // Use existing product
            job = tryOnService.submitTryOnJob(productId, userImage);
            log.info("Submitted try-on job {} with existing product: {}", job.getJobId(), productId);
        } else {
            // Use uploaded product image with default naming
            String productName = (productImage != null && productImage.getOriginalFilename() != null) ? 
                productImage.getOriginalFilename() : "uploaded-product";
            job = tryOnService.submitTryOnJob(productImage, userImage, productName, "general");
            log.info("Submitted try-on job {} with new product image: {}", job.getJobId(), 
                productImage != null ? productImage.getOriginalFilename() : "uploaded-product");
        }

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(job);
    }

    @Operation(
        summary = "Get try-on job status",
        description = "Check the status of a virtual try-on job. Returns current status (QUEUED/RUNNING/SUCCEEDED/FAILED) " +
                     "and result image URL when processing is complete.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Job status retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Job ID not found")
        }
    )
    @GetMapping(value = "/{jobId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TryOnJobResponse> getJobStatus(
            @Parameter(description = "Try-on job ID", required = true, example = "job-123e4567-e89b-12d3-a456-426614174000")
            @PathVariable String jobId
    ) {
        try {
            TryOnJobResponse job = tryOnService.getJobStatus(jobId);
            log.debug("Retrieved status for job: {} - {}", jobId, job.getStatus());
            return ResponseEntity.ok(job);
        } catch (IllegalArgumentException e) {
            log.warn("Job not found: {}", jobId);
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(
        summary = "Get all try-on jobs",
        description = "Retrieve all try-on jobs for monitoring and debugging (admin endpoint)",
        responses = {
            @ApiResponse(responseCode = "200", description = "All jobs retrieved successfully")
        }
    )
    @GetMapping(value = "/jobs", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAllJobs() {
        var jobs = tryOnService.getAllJobs();
        log.debug("Retrieved {} total jobs", jobs.size());
        return ResponseEntity.ok(jobs);
    }
}
