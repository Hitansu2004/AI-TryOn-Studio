package com.tryon.service;

import com.tryon.dto.ProductRequest;
import com.tryon.dto.ProductResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for managing product metadata and image storage
 * Uses in-memory storage for this prototype - can be replaced with JPA/database later
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ImageStorageService imageStorageService;

    // In-memory storage for prototype - replace with database in production
    private final Map<String, ProductResponse> products = new ConcurrentHashMap<>();

    /**
     * Create a new product with image upload
     */
    public ProductResponse createProduct(ProductRequest request, MultipartFile imageFile) throws IOException {
        String productId = UUID.randomUUID().toString();

        // Store the product image
        String imagePath = imageStorageService.storeProductImage(imageFile, productId);
        String imageUrl = imageStorageService.generatePublicUrl(imagePath, "products");

        // Create product response
        ProductResponse product = ProductResponse.builder()
                .id(productId)
                .name(request.getName())
                .sku(request.getSku())
                .color(request.getColor())
                .description(request.getDescription())
                .imageUrl(imageUrl)
                .originalFilename(imageFile.getOriginalFilename())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Store in memory
        products.put(productId, product);

        log.info("Created product: {} with ID: {}", request.getName(), productId);
        return product;
    }

    /**
     * Create a new product from JSON data (for demo purposes with pre-existing images)
     */
    public ProductResponse createProductFromJson(ProductRequest request) {
        String productId = UUID.randomUUID().toString();

        // Create product response using provided image URL
        ProductResponse product = ProductResponse.builder()
                .id(productId)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice() != null ? BigDecimal.valueOf(request.getPrice()) : null)
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .sizes(request.getSizes())
                .colors(request.getColors())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Store in memory
        products.put(productId, product);

        log.info("Created product from JSON: {} with ID: {}", request.getName(), productId);
        return product;
    }

    /**
     * Create a new product with a specific ID (for initialization)
     */
    public ProductResponse createProductWithId(String productId, ProductRequest request) {
        // Create product response using provided image URL
        ProductResponse product = ProductResponse.builder()
                .id(productId)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice() != null ? BigDecimal.valueOf(request.getPrice()) : null)
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .sizes(request.getSizes())
                .colors(request.getColors())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Store in memory
        products.put(productId, product);

        log.info("Created product with ID {}: {}", productId, request.getName());
        return product;
    }

    /**
     * Get all products with pagination support
     */
    public List<ProductResponse> getAllProducts() {
        return products.values()
                .stream()
                .sorted((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt())) // Latest first
                .toList();
    }

    /**
     * Get a specific product by ID
     */
    public Optional<ProductResponse> getProductById(String productId) {
        return Optional.ofNullable(products.get(productId));
    }

    /**
     * Check if a product exists
     */
    public boolean productExists(String productId) {
        return products.containsKey(productId);
    }

    /**
     * Update product metadata (keeping the same image)
     */
    public Optional<ProductResponse> updateProduct(String productId, ProductRequest request) {
        ProductResponse existingProduct = products.get(productId);
        if (existingProduct == null) {
            return Optional.empty();
        }

        ProductResponse updatedProduct = ProductResponse.builder()
                .id(existingProduct.getId())
                .name(request.getName())
                .sku(request.getSku())
                .color(request.getColor())
                .description(request.getDescription())
                .imageUrl(existingProduct.getImageUrl())
                .originalFilename(existingProduct.getOriginalFilename())
                .createdAt(existingProduct.getCreatedAt())
                .updatedAt(LocalDateTime.now())
                .build();

        products.put(productId, updatedProduct);
        log.info("Updated product: {}", productId);
        return Optional.of(updatedProduct);
    }

    /**
     * Delete a product
     */
    public boolean deleteProduct(String productId) {
        ProductResponse removed = products.remove(productId);
        if (removed != null) {
            log.info("Deleted product: {}", productId);
            return true;
        }
        return false;
    }

    /**
     * Get product statistics
     */
    public Map<String, Object> getProductStats() {
        return Map.of(
                "totalProducts", products.size(),
                "lastCreated", products.values().stream()
                        .map(ProductResponse::getCreatedAt)
                        .max(LocalDateTime::compareTo)
                        .orElse(null)
        );
    }
}
