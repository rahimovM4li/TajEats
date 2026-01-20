package com.tajeats.tajeats_backend.controller;

import com.tajeats.tajeats_backend.exception.ResourceNotFoundException;
import com.tajeats.tajeats_backend.model.Restaurant;
import com.tajeats.tajeats_backend.repository.RestaurantRepository;
import com.tajeats.tajeats_backend.service.ImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class RestaurantImageController {

    private final RestaurantRepository restaurantRepository;
    private final ImageStorageService imageStorageService;

    @PostMapping("/{id}/image")
    public ResponseEntity<Map<String, String>> uploadRestaurantImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        // Delete old image if exists
        if (restaurant.getImage() != null) {
            imageStorageService.delete(restaurant.getImage());
        }

        // Store new image
        String imageUrl = imageStorageService.store(file, "restaurants");
        restaurant.setImage(imageUrl);
        restaurantRepository.save(restaurant);

        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", imageUrl);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/logo")
    public ResponseEntity<Map<String, String>> uploadRestaurantLogo(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        // Delete old logo if exists
        if (restaurant.getLogo() != null) {
            imageStorageService.delete(restaurant.getLogo());
        }

        // Store new logo
        String logoUrl = imageStorageService.store(file, "restaurants/logos");
        restaurant.setLogo(logoUrl);
        restaurantRepository.save(restaurant);

        Map<String, String> response = new HashMap<>();
        response.put("logoUrl", logoUrl);
        return ResponseEntity.ok(response);
    }
}
