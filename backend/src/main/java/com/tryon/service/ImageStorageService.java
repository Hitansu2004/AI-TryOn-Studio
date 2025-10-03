package com.tryon.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

/**
 * Service for handling file storage operations with validation and security
 */
@Service
@Slf4j
public class ImageStorageService {

    @Value("${storage.products}")
    private String productsDirectory;

    @Value("${storage.user-uploads}")
    private String userUploadsDirectory;

    @Value("${storage.results}")
    private String resultsDirectory;

    @Value("${storage.allowed-content-types}")
    private List<String> allowedContentTypes;

    @Value("${storage.max-file-size}")
    private long maxFileSize;

    @Value("${server.port}")
    private String serverPort;

    /**
     * Store a product image and return the file path
     */
    public String storeProductImage(MultipartFile file, String productId) throws IOException {
        validateFile(file);
        ensureDirectoryExists(productsDirectory);

        String filename = generateSafeFilename(productId, file.getOriginalFilename());
        Path targetPath = Paths.get(productsDirectory, filename);

        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        log.info("Stored product image: {} -> {}", file.getOriginalFilename(), targetPath);

        return targetPath.toString();
    }

    /**
     * Store a user uploaded image for try-on processing
     */
    public String storeUserImage(MultipartFile file) throws IOException {
        validateFile(file);
        ensureDirectoryExists(userUploadsDirectory);

        String filename = generateSafeFilename(UUID.randomUUID().toString(), file.getOriginalFilename());
        Path targetPath = Paths.get(userUploadsDirectory, filename);

        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        log.info("Stored user image: {} -> {}", file.getOriginalFilename(), targetPath);

        return targetPath.toString();
    }

    /**
     * Store a generated result image from try-on processing
     */
    public String storeResultImage(byte[] imageData, String jobId, String extension) throws IOException {
        ensureDirectoryExists(resultsDirectory);

        String filename = sanitizeFilename(jobId) + "." + extension;
        Path targetPath = Paths.get(resultsDirectory, filename);

        Files.write(targetPath, imageData);
        log.info("Stored result image: {}", targetPath);

        return targetPath.toString();
    }

    /**
     * Generate public URL for accessing stored images
     */
    public String generatePublicUrl(String filePath, String category) {
        Path path = Paths.get(filePath);
        String filename = path.getFileName().toString();
        return String.format("http://localhost:%s/api/images/%s/%s", serverPort, category, filename);
    }

    /**
     * Get the actual file path for serving images
     */
    public Path getImagePath(String category, String filename) {
        return switch (category) {
            case "products" -> Paths.get(productsDirectory, filename);
            case "user" -> Paths.get(userUploadsDirectory, filename);
            case "results" -> Paths.get(resultsDirectory, filename);
            default -> throw new IllegalArgumentException("Invalid image category: " + category);
        };
    }

    /**
     * Validate uploaded file for security and constraints
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of " + maxFileSize + " bytes");
        }

        String contentType = file.getContentType();
        if (contentType == null || !allowedContentTypes.contains(contentType)) {
            throw new IllegalArgumentException("File type not allowed. Supported types: " + allowedContentTypes);
        }

        // Additional validation using file extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !hasValidImageExtension(originalFilename)) {
            throw new IllegalArgumentException("Invalid file extension. Only .jpg, .jpeg, .png files are allowed");
        }
    }

    /**
     * Generate a safe filename with UUID prefix to avoid conflicts
     */
    private String generateSafeFilename(String prefix, String originalFilename) {
        String extension = getFileExtension(originalFilename);
        String safePrefix = sanitizeFilename(prefix);
        return safePrefix + "." + extension;
    }

    /**
     * Sanitize filename to prevent path traversal and other security issues
     */
    private String sanitizeFilename(String filename) {
        if (filename == null) {
            return "unknown";
        }

        return filename.replaceAll("[^a-zA-Z0-9.-]", "_")
                      .replaceAll("\\.+", ".")
                      .replaceAll("^\\.|\\.$", "");
    }

    /**
     * Extract file extension from filename
     */
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "jpg"; // default extension
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }

    /**
     * Check if filename has valid image extension
     */
    private boolean hasValidImageExtension(String filename) {
        String extension = getFileExtension(filename);
        return List.of("jpg", "jpeg", "png").contains(extension);
    }

    /**
     * Ensure directory exists, create if necessary
     */
    private void ensureDirectoryExists(String directory) throws IOException {
        Path dirPath = Paths.get(directory);
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
            log.info("Created directory: {}", dirPath);
        }
    }
}
