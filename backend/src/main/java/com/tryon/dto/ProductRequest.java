package com.tryon.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

/**
 * Request DTO for creating a new product with image upload
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Product creation request")
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Product name must not exceed 100 characters")
    @Schema(description = "Product name", example = "Classic Blue Jeans", required = true)
    private String name;

    @Size(max = 50, message = "SKU must not exceed 50 characters")
    @Schema(description = "Product SKU/identifier", example = "JEANS-001-BLUE")
    private String sku;

    @Size(max = 50, message = "Color must not exceed 50 characters")
    @Schema(description = "Product color", example = "Blue")
    private String color;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    @Schema(description = "Product description", example = "Comfortable classic fit blue jeans")
    private String description;

    @PositiveOrZero(message = "Price must be zero or positive")
    @Schema(description = "Product price", example = "79.99")
    private Double price;

    @Size(max = 50, message = "Category must not exceed 50 characters")
    @Schema(description = "Product category", example = "jackets")
    private String category;

    @Schema(description = "Product image URL", example = "http://localhost:8080/api/images/products/image.jpg")
    private String imageUrl;

    @Schema(description = "Available sizes", example = "[\"S\", \"M\", \"L\", \"XL\"]")
    private List<String> sizes;

    @Schema(description = "Available colors", example = "[\"Blue\", \"Black\", \"White\"]")
    private List<String> colors;
}
