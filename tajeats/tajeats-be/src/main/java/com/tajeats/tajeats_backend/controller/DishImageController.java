package com.tajeats.tajeats_backend.controller;

import com.tajeats.tajeats_backend.exception.ResourceNotFoundException;
import com.tajeats.tajeats_backend.model.Dish;
import com.tajeats.tajeats_backend.repository.DishRepository;
import com.tajeats.tajeats_backend.service.ImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dishes")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DishImageController {

    private final DishRepository dishRepository;
    private final ImageStorageService imageStorageService;

    @PostMapping("/{id}/image")
    public ResponseEntity<Map<String, String>> uploadDishImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dish not found"));

        // Delete old image if exists
        if (dish.getImage() != null) {
            imageStorageService.delete(dish.getImage());
        }

        // Store new image
        String imageUrl = imageStorageService.store(file, "dishes");
        dish.setImage(imageUrl);
        dishRepository.save(dish);

        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", imageUrl);
        return ResponseEntity.ok(response);
    }
}
