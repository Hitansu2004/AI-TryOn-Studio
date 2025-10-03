package com.tryon.service;

import com.tryon.dto.ProductRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Initializes product data on application startup
 * This loads the 5 products that match the frontend images
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ProductDataInitializer implements CommandLineRunner {

    private final ProductService productService;

    @Override
    public void run(String... args) throws Exception {
        log.info("Initializing product data...");
        
        // Create the 5 products that match your uploaded images
        List<ProductRequest> initialProducts = Arrays.asList(
            ProductRequest.builder()
                .name("Classic Blue Denim Jacket")
                .description("Timeless blue denim jacket perfect for casual outings. Made from high-quality cotton denim with a comfortable fit and durable construction.")
                .price(79.99)
                .category("jackets")
                .imageUrl("/products/product-1.jpg")
                .sizes(Arrays.asList("S", "M", "L", "XL", "XXL"))
                .colors(Arrays.asList("Blue", "Light Blue", "Dark Blue"))
                .build(),
                
            ProductRequest.builder()
                .name("Casual Knit Sweater")
                .description("Cozy and comfortable knit sweater perfect for everyday wear. Soft fabric with excellent warmth and breathability.")
                .price(59.99)
                .category("sweaters")
                .imageUrl("/products/product-2.jpg")
                .sizes(Arrays.asList("XS", "S", "M", "L", "XL"))
                .colors(Arrays.asList("Gray", "Navy", "Beige", "Black"))
                .build(),
                
            ProductRequest.builder()
                .name("Classic White Shirt")
                .description("Timeless white button-down shirt suitable for both formal and casual occasions. Premium cotton fabric with excellent fit.")
                .price(45.99)
                .category("shirts")
                .imageUrl("/products/product-3.avif")
                .sizes(Arrays.asList("S", "M", "L", "XL", "XXL"))
                .colors(Arrays.asList("White", "Light Blue", "Pink", "Light Gray"))
                .build(),
                
            ProductRequest.builder()
                .name("Black Pullover Hoodie")
                .description("Comfortable black hoodie with front pocket and adjustable drawstring. Perfect for casual wear and workouts.")
                .price(69.99)
                .category("hoodies")
                .imageUrl("/products/product-4.jpg")
                .sizes(Arrays.asList("S", "M", "L", "XL", "XXL"))
                .colors(Arrays.asList("Black", "Gray", "Navy", "Burgundy"))
                .build(),
                
            ProductRequest.builder()
                .name("Summer Floral Dress")
                .description("Light and breezy summer dress with beautiful floral pattern. Perfect for warm weather and special occasions.")
                .price(89.99)
                .category("dresses")
                .imageUrl("/products/product-5.avif")
                .sizes(Arrays.asList("XS", "S", "M", "L", "XL"))
                .colors(Arrays.asList("Floral Print", "Solid Blue", "Solid Pink", "White"))
                .build()
        );

        // Create products with fixed IDs
        for (int i = 0; i < initialProducts.size(); i++) {
            ProductRequest request = initialProducts.get(i);
            String productId = String.valueOf(i + 1); // IDs: 1, 2, 3, 4, 5
            
            // Create product with specific ID
            createProductWithId(productId, request);
        }
        
        log.info("Initialized {} products", initialProducts.size());
    }
    
    private void createProductWithId(String productId, ProductRequest request) {
        try {
            productService.createProductWithId(productId, request);
            log.debug("Created product with ID {}: {}", productId, request.getName());
        } catch (Exception e) {
            log.error("Failed to create product with ID {}: {}", productId, e.getMessage());
        }
    }
}
