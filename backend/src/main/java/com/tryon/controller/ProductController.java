package com.tryon.controller;

import com.tryon.dto.ProductRequest;
import com.tryon.dto.ProductResponse;
import com.tryon.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * REST Controller for product management and image upload
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Validated
@Slf4j
@Tag(name = "Products", description = "Product management APIs for virtual try-on")
public class ProductController {

    private final ProductService productService;

    @Operation(
        summary = "Upload product with image",
        description = "Create a new product by uploading an image with metadata. " +
                     "The image will be stored and made available via a public URL for the frontend.",
        responses = {
            @ApiResponse(responseCode = "201", description = "Product created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or file validation failed"),
            @ApiResponse(responseCode = "413", description = "File size exceeds maximum limit")
        }
    )
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProductResponse> createProduct(
            @Parameter(description = "Product image file (JPEG/PNG, max 10MB)", required = true)
            @RequestParam("image") MultipartFile image,

            @Parameter(description = "Product name", required = true, example = "Classic Blue Jeans")
            @RequestParam("name") String name,

            @Parameter(description = "Product SKU/identifier", required = true, example = "JEANS-001-BLUE")
            @RequestParam("sku") String sku,

            @Parameter(description = "Product color", example = "Blue")
            @RequestParam(value = "color", required = false) String color,

            @Parameter(description = "Product description", example = "Comfortable classic fit blue jeans")
            @RequestParam(value = "description", required = false) String description
    ) throws IOException {

        // Create ProductRequest from form parameters
        ProductRequest request = new ProductRequest();
        request.setName(name);
        request.setSku(sku);
        request.setColor(color);
        request.setDescription(description);

        ProductResponse product = productService.createProduct(request, image);
        log.info("Created product: {} with ID: {}", product.getName(), product.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @Operation(
        summary = "Create product from JSON",
        description = "Create a new product from JSON data (for demo purposes with pre-existing images)",
        responses = {
            @ApiResponse(responseCode = "201", description = "Product created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
        }
    )
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProductResponse> createProductFromJson(
            @Parameter(description = "Product information", required = true)
            @Valid @RequestBody ProductRequest request
    ) {
        ProductResponse product = productService.createProductFromJson(request);
        log.info("Created product from JSON: {} with ID: {}", product.getName(), product.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @Operation(
        summary = "List all products",
        description = "Retrieve all products with their metadata and image URLs for the frontend grid display",
        responses = {
            @ApiResponse(responseCode = "200", description = "Products retrieved successfully")
        }
    )
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> products = productService.getAllProducts();
        log.debug("Retrieved {} products", products.size());
        return ResponseEntity.ok(products);
    }

    @Operation(
        summary = "Get product by ID",
        description = "Retrieve a specific product's metadata and image URL",
        responses = {
            @ApiResponse(responseCode = "200", description = "Product found"),
            @ApiResponse(responseCode = "404", description = "Product not found")
        }
    )
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProductResponse> getProductById(
            @Parameter(description = "Product ID", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable String id
    ) {
        return productService.getProductById(id)
                .map(product -> {
                    log.debug("Retrieved product: {}", id);
                    return ResponseEntity.ok(product);
                })
                .orElseGet(() -> {
                    log.warn("Product not found: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @Operation(
        summary = "Update product metadata",
        description = "Update product information while keeping the same image",
        responses = {
            @ApiResponse(responseCode = "200", description = "Product updated successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
        }
    )
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProductResponse> updateProduct(
            @Parameter(description = "Product ID", required = true)
            @PathVariable String id,

            @Parameter(description = "Updated product information", required = true)
            @Valid @RequestBody ProductRequest request
    ) {
        return productService.updateProduct(id, request)
                .map(product -> {
                    log.info("Updated product: {}", id);
                    return ResponseEntity.ok(product);
                })
                .orElseGet(() -> {
                    log.warn("Product not found for update: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @Operation(
        summary = "Delete product",
        description = "Remove a product and its associated image",
        responses = {
            @ApiResponse(responseCode = "204", description = "Product deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found")
        }
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @Parameter(description = "Product ID", required = true)
            @PathVariable String id
    ) {
        boolean deleted = productService.deleteProduct(id);
        if (deleted) {
            log.info("Deleted product: {}", id);
            return ResponseEntity.noContent().build();
        } else {
            log.warn("Product not found for deletion: {}", id);
            return ResponseEntity.notFound().build();
        }
    }
}
