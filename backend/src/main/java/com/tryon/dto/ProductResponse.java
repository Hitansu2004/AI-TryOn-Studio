package com.tryon.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for product information including image URL
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Product response with metadata and image URL")
public class ProductResponse {

    @Schema(description = "Product ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private String id;

    @Schema(description = "Product name", example = "Classic Blue Jeans")
    private String name;

    @Schema(description = "Product SKU", example = "JEANS-001-BLUE")
    private String sku;

    @Schema(description = "Product color", example = "Blue")
    private String color;

    @Schema(description = "Product description", example = "Comfortable classic fit blue jeans")
    private String description;

    @Schema(description = "Product price", example = "79.99")
    private BigDecimal price;

    @Schema(description = "Product category", example = "jackets")
    private String category;

    @Schema(description = "Available sizes", example = "[\"S\", \"M\", \"L\", \"XL\"]")
    private List<String> sizes;

    @Schema(description = "Available colors", example = "[\"Blue\", \"Black\", \"White\"]")
    private List<String> colors;

    @Schema(description = "URL to access product image", example = "http://localhost:8080/api/images/products/123e4567-e89b-12d3-a456-426614174000.jpg")
    private String imageUrl;

    @Schema(description = "Original filename of uploaded image", example = "blue-jeans.jpg")
    private String originalFilename;

    @Schema(description = "Product creation timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Product last update timestamp")
    private LocalDateTime updatedAt;
}
