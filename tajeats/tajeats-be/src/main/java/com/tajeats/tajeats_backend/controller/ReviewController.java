package com.tajeats.tajeats_backend.controller;

import com.tajeats.tajeats_backend.dto.ReviewDTO;
import com.tajeats.tajeats_backend.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public List<ReviewDTO> getReviews(@RequestParam(required = false) Long restaurantId) {
        if (restaurantId != null) {
            return reviewService.getByRestaurant(restaurantId);
        }
        return reviewService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewDTO> getReview(@PathVariable Long id) {
        return  ResponseEntity.ok(reviewService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(@RequestBody ReviewDTO dto) {
        return ResponseEntity.ok(reviewService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewDTO> updateReview(@PathVariable Long id, @RequestBody ReviewDTO dto) {
        return ResponseEntity.ok(reviewService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
