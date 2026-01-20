package com.tajeats.tajeats_backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class FileSystemImageStorageService implements ImageStorageService {

    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
            "image/jpeg", "image/png", "image/webp"
    );
    
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    @Value("${app.storage.base-path:uploads}")
    private String basePath;

    @Value("${app.storage.base-url:http://localhost:8080/images}")
    private String baseUrl;

    @Override
    public String store(MultipartFile file, String directory) {
        validateImage(file);

        try {
            // Create directory structure
            Path uploadPath = Paths.get(basePath, directory);
            Files.createDirectories(uploadPath);

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg";
            String filename = UUID.randomUUID().toString() + extension;

            // Store file
            Path targetLocation = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return public URL
            String imageUrl = String.format("%s/%s/%s", baseUrl, directory, filename);
            log.info("Image stored successfully: {}", imageUrl);
            return imageUrl;

        } catch (IOException e) {
            log.error("Failed to store image", e);
            throw new RuntimeException("Failed to store image: " + e.getMessage());
        }
    }

    @Override
    public void delete(String imageUrl) {
        if (imageUrl == null || !imageUrl.startsWith(baseUrl)) {
            return;
        }

        try {
            // Extract path from URL
            String relativePath = imageUrl.substring(baseUrl.length() + 1);
            Path filePath = Paths.get(basePath, relativePath);

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("Image deleted: {}", imageUrl);
            }
        } catch (IOException e) {
            log.error("Failed to delete image: {}", imageUrl, e);
        }
    }

    @Override
    public void validateImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    String.format("File size exceeds maximum allowed size of %d MB", MAX_FILE_SIZE / 1024 / 1024)
            );
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException(
                    "Invalid file type. Allowed types: " + String.join(", ", ALLOWED_MIME_TYPES)
            );
        }
    }
}
