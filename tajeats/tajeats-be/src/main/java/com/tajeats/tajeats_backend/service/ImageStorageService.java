package com.tajeats.tajeats_backend.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * Abstraction for image storage.
 * Allows switching between filesystem, S3, MinIO without changing business logic.
 */
public interface ImageStorageService {
    
    /**
     * Store an image and return its public URL.
     * @param file The uploaded image file
     * @param directory Target directory (e.g., "restaurants", "dishes")
     * @return Public URL to access the stored image
     */
    String store(MultipartFile file, String directory);
    
    /**
     * Delete an image by its filename.
     * @param imageUrl The URL/path of the image to delete
     */
    void delete(String imageUrl);
    
    /**
     * Validate file type and size.
     * @param file The file to validate
     * @throws IllegalArgumentException if validation fails
     */
    void validateImage(MultipartFile file);
}
