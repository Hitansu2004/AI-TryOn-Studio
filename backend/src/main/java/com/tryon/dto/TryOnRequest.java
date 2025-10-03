package com.tryon.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Request DTO for virtual try-on processing
 *
 * Either productId OR productImage must be provided (mutually exclusive).
 * UserImage and prompt are always required.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Virtual try-on request - requires either productId or productImage file, plus userImage and prompt")
public class TryOnRequest {

    @Schema(description = "Existing product ID to use for try-on (mutually exclusive with productImage)",
            example = "123e4567-e89b-12d3-a456-426614174000")
    private String productId;

    @NotBlank(message = "Text prompt is required")
    @Size(max = 500, message = "Prompt must not exceed 500 characters")
    @Schema(description = "Text prompt describing the desired try-on result",
            example = "Show the blue jeans on the person with a casual fit",
            required = true)
    private String prompt;

    // Note: MultipartFile fields (productImage, userImage) are handled separately in the controller
    // as they cannot be part of a JSON request body when using multipart/form-data
}
