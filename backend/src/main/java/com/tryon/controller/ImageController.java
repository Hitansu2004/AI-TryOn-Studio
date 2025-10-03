package com.tryon.controller;

import com.tryon.service.ImageStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Controller for serving stored images to the frontend
 */
@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Image Serving", description = "Endpoints for serving stored images")
public class ImageController {

    private final ImageStorageService imageStorageService;

    @Operation(
        summary = "Serve stored images",
        description = "Serve images from different categories (products, user, results) to the frontend",
        responses = {
            @ApiResponse(responseCode = "200", description = "Image served successfully"),
            @ApiResponse(responseCode = "404", description = "Image not found")
        }
    )
    @GetMapping("/{category}/{filename:.+}")
    public ResponseEntity<Resource> serveImage(
            @Parameter(description = "Image category", example = "products")
            @PathVariable String category,

            @Parameter(description = "Image filename", example = "123e4567-e89b-12d3-a456-426614174000.jpg")
            @PathVariable String filename
    ) {
        try {
            Path imagePath = imageStorageService.getImagePath(category, filename);

            if (!Files.exists(imagePath)) {
                log.warn("Image not found: {}/{}", category, filename);
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(imagePath.toUri());

            // Determine content type
            String contentType = Files.probeContentType(imagePath);
            if (contentType == null) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            log.debug("Serving image: {}/{}", category, filename);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);

        } catch (Exception e) {
            log.error("Error serving image {}/{}: {}", category, filename, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
