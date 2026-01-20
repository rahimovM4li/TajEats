package com.tajeats.tajeats_backend.service;

import com.tajeats.tajeats_backend.dto.ReviewDTO;
import com.tajeats.tajeats_backend.exception.ResourceNotFoundException;
import com.tajeats.tajeats_backend.model.Restaurant;
import com.tajeats.tajeats_backend.model.Review;
import com.tajeats.tajeats_backend.repository.RestaurantRepository;
import com.tajeats.tajeats_backend.repository.ReviewRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;

    private ReviewDTO toDTO(Review r) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(r.getId());
        dto.setRestaurantId(r.getRestaurant().getId());
        dto.setUserName(r.getUserName());
        dto.setUserAvatar(r.getUserAvatar());
        dto.setRating(r.getRating());
        dto.setComment(r.getComment());
        dto.setDate(r.getDate());
        return dto;
    }

    private Review toEntity(ReviewDTO dto) {
        Review r = new Review();
        r.setId(dto.getId());
        r.setUserName(dto.getUserName());
        r.setUserAvatar(dto.getUserAvatar());
        r.setRating(dto.getRating());
        r.setComment(dto.getComment());
        r.setDate(dto.getDate());

        Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        r.setRestaurant(restaurant);

        return r;
    }

    public List<ReviewDTO> getAll() {
        return reviewRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ReviewDTO getById(Long id) {
        return reviewRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
    }

    public ReviewDTO create(ReviewDTO dto) {
        Review saved = reviewRepository.save(toEntity(dto));
        
        // Auto-update restaurant rating
        updateRestaurantRating(dto.getRestaurantId());
        
        return toDTO(saved);
    }

    public ReviewDTO update(Long id, ReviewDTO dto) {
        return reviewRepository.findById(id).map(existing -> {

            existing.setUserName(dto.getUserName());
            existing.setUserAvatar(dto.getUserAvatar());
            existing.setRating(dto.getRating());
            existing.setComment(dto.getComment());
            existing.setDate(dto.getDate());

            Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

            existing.setRestaurant(restaurant);

            return toDTO(existing);

        }).orElseThrow(() -> new ResourceNotFoundException("Review not found"));
    }

    public void delete(Long id) {
        reviewRepository.deleteById(id);
    }
    
    // ---------- Custom Queries ----------
    public List<ReviewDTO> getByRestaurant(Long restaurantId) {
        return reviewRepository.findByRestaurantIdOrderByDateDesc(restaurantId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    // ---------- Helper Methods ----------
    private void updateRestaurantRating(Long restaurantId) {
        Double avgRating = reviewRepository.findAverageRatingByRestaurantId(restaurantId);
        Long reviewCount = reviewRepository.countByRestaurantId(restaurantId);
        
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        
        restaurant.setRating(avgRating != null ? avgRating : 0.0);
        restaurant.setReviewCount(reviewCount != null ? reviewCount.intValue() : 0);
        
        restaurantRepository.save(restaurant);
    }
}
