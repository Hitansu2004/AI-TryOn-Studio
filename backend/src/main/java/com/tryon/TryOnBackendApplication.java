package com.tryon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Virtual Try-On E-commerce Backend Application
 *
 * This Spring Boot application provides REST APIs for:
 * - Product image management
 * - Virtual try-on processing via external microservice
 * - File storage and retrieval
 */
@SpringBootApplication
@EnableAsync
public class TryOnBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(TryOnBackendApplication.class, args);
    }
}
