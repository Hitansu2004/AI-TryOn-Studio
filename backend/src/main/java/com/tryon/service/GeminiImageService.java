package com.tryon.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.*;

/**
 * Service for virtual try-on image generation using Google Gemini 2.5 Flash Image (Nano Banana)
 *
 * This service integrates with Google's latest image generation model that excels at:
 * - Virtual try-on image generation by combining product and customer images
 * - High-fidelity photorealistic results with proper fit and draping
 * - Conversational image editing and refinement
 * - Accurate color matching and realistic garment representation
 *
 * Uses the new Gemini 2.5 Flash Image Preview model for enhanced image generation.
 */
@Service
@Slf4j
public class GeminiImageService {

        @Value("${gemini.api-key}")
    private String apiKey;
    
    @Value("${gemini.api-url}")
    private String geminiApiUrl;
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Generate virtual try-on image using Gemini API
     * Combines product image and customer image with AI-generated realistic try-on result
     *
     * @param productImagePath Path to the product image file
     * @param customerImagePath Path to the customer image file  
     * @param prompt Detailed prompt for virtual try-on generation
     * @return Generated try-on image as byte array
     */
    public byte[] generateVirtualTryOnImage(String productImagePath, String customerImagePath, String prompt) throws IOException {
        if (!isGeminiApiAvailable()) {
            throw new IllegalStateException("GEMINI_API_KEY not configured. Please set the environment variable.");
        }

        log.info("Starting virtual try-on generation with Gemini API");
        log.debug("Product image: {}, Customer image: {}", productImagePath, customerImagePath);

        try {
            // Read image files
            byte[] productImageData = Files.readAllBytes(Paths.get(productImagePath));
            byte[] customerImageData = Files.readAllBytes(Paths.get(customerImagePath));

            log.info("Loaded images - Product: {} bytes, Customer: {} bytes", 
                    productImageData.length, customerImageData.length);

            // Create request payload for Gemini API
            Map<String, Object> requestBody = createTryOnRequestBody(prompt, productImageData, customerImageData);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            log.info("Calling Gemini API for virtual try-on generation...");

            // Call Gemini API
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                geminiApiUrl,
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                log.info("Gemini API call successful, processing response...");
                return processGeminiResponse(response.getBody());
            } else {
                throw new RuntimeException("Gemini API returned error: " + response.getStatusCode());
            }

        } catch (Exception e) {
            log.error("Error generating virtual try-on with Gemini API: {}", e.getMessage(), e);
            throw new IOException("Virtual try-on generation failed: " + e.getMessage(), e);
        }
    }

        /**
     * Create request body for Gemini 2.5 Flash Image API virtual try-on
     */
    private Map<String, Object> createTryOnRequestBody(String prompt, byte[] productImage, byte[] customerImage) {
        Map<String, Object> requestBody = new HashMap<>();
        
        // Create contents array with prompt and images
        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> content = new HashMap<>();
        
        List<Object> parts = new ArrayList<>();
        
        // Add text prompt
        Map<String, Object> textPart = Map.of("text", prompt);
        parts.add(textPart);
        
        // Add product image
        Map<String, Object> productImagePart = Map.of(
            "inline_data", Map.of(
                "mime_type", "image/jpeg",
                "data", Base64.getEncoder().encodeToString(productImage)
            )
        );
        parts.add(productImagePart);
        
        // Add customer image
        Map<String, Object> customerImagePart = Map.of(
            "inline_data", Map.of(
                "mime_type", "image/jpeg", 
                "data", Base64.getEncoder().encodeToString(customerImage)
            )
        );
        parts.add(customerImagePart);
        
        content.put("parts", parts);
        contents.add(content);
        requestBody.put("contents", contents);
        
        // Add generation config for image output
        Map<String, Object> generationConfig = Map.of(
            "temperature", 0.4,
            "topK", 32,
            "topP", 1.0,
            "maxOutputTokens", 4096,
            "responseMimeType", "application/json"
        );
        requestBody.put("generationConfig", generationConfig);
        
        // Add safety settings
        List<Map<String, Object>> safetySettings = List.of(
            Map.of("category", "HARM_CATEGORY_HARASSMENT", "threshold", "BLOCK_MEDIUM_AND_ABOVE"),
            Map.of("category", "HARM_CATEGORY_HATE_SPEECH", "threshold", "BLOCK_MEDIUM_AND_ABOVE"),
            Map.of("category", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold", "BLOCK_MEDIUM_AND_ABOVE"),
            Map.of("category", "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold", "BLOCK_MEDIUM_AND_ABOVE")
        );
        requestBody.put("safetySettings", safetySettings);
        
        return requestBody;
    }

    /**
     * Process Gemini 2.5 Flash Image API response and extract generated image
     */
    @SuppressWarnings("unchecked")
    private byte[] processGeminiResponse(Map<String, Object> responseBody) {
        try {
            log.debug("Processing Gemini 2.5 Flash Image response: {}", responseBody);
            
            // Navigate response structure: candidates[0].content.parts[]
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                throw new RuntimeException("No candidates found in Gemini response");
            }

            Map<String, Object> firstCandidate = candidates.get(0);
            log.debug("Processing first candidate: {}", firstCandidate);

            Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
            if (content == null) {
                throw new RuntimeException("No content found in candidate");
            }

            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            if (parts == null || parts.isEmpty()) {
                throw new RuntimeException("No parts found in content");
            }

            // Look for parts with inline_data (generated images)
            for (Map<String, Object> part : parts) {
                if (part.containsKey("inline_data")) {
                    Map<String, Object> inlineData = (Map<String, Object>) part.get("inline_data");
                    if (inlineData.containsKey("data")) {
                        String base64Data = (String) inlineData.get("data");
                        log.info("Found generated image in response, size: {} characters", base64Data.length());
                        return Base64.getDecoder().decode(base64Data);
                    }
                }
            }
            
            throw new RuntimeException("No image data found in Gemini response parts");
            
        } catch (Exception e) {
            log.error("Error processing Gemini response: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to process Gemini API response: " + e.getMessage(), e);
        }
    }

    /**
     * Generate marketing images using Gemini 2.5 Flash Image
     * Example use case: Create lifestyle photos of products in different settings
     */
    public byte[] generateMarketingImage(String prompt, byte[] baseImage) throws IOException {
        if (!isGeminiApiAvailable()) {
            throw new IllegalStateException("GEMINI_API_KEY not configured");
        }

        log.info("Generating marketing image with prompt: {}", prompt);

        try {
            Map<String, Object> requestBody = new HashMap<>();
            List<Map<String, Object>> parts = new ArrayList<>();

            // Add text prompt
            parts.add(Map.of("text", prompt));

            // Add base image if provided
            if (baseImage != null) {
                Map<String, Object> imagePart = Map.of(
                    "inlineData", Map.of(
                        "mimeType", "image/jpeg",
                        "data", Base64.getEncoder().encodeToString(baseImage)
                    )
                );
                parts.add(imagePart);
            }

            requestBody.put("contents", List.of(Map.of("parts", parts)));

            // Configure generation parameters
            Map<String, Object> generationConfig = Map.of(
                "temperature", 0.4,
                "candidateCount", 1,
                "maxOutputTokens", 2048
            );
            requestBody.put("generationConfig", generationConfig);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Call Gemini API
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                geminiApiUrl,
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                log.info("Successfully generated marketing image with Gemini API");
                return processGeminiResponse(response.getBody());
            }

            throw new RuntimeException("Failed to generate marketing image with Gemini API");

        } catch (Exception e) {
            log.error("Error calling Gemini API for marketing image generation: {}", e.getMessage(), e);
            throw new IOException("Marketing image generation failed: " + e.getMessage(), e);
        }
    }

    /**
     * Check if Gemini API is configured and available
     */
    public boolean isGeminiApiAvailable() {
        return apiKey != null && !apiKey.trim().isEmpty();
    }

    /**
     * Get configuration status for monitoring
     */
    public String getConfigurationStatus() {
        if (isGeminiApiAvailable()) {
            return "Gemini API configured and ready for virtual try-on and creative image generation";
        } else {
            return "Gemini API not configured - set GEMINI_API_KEY environment variable to enable virtual try-on features";
        }
    }
}
