package com.tajeats.tajeats_backend.repository;

import com.tajeats.tajeats_backend.model.Review;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRestaurantId(Long restaurantId);
    List<Review> findByRestaurantIdOrderByDateDesc(Long restaurantId);
    List<Review> findByRatingGreaterThanEqual(Integer minRating);
    Long countByRestaurantId(Long restaurantId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.restaurant.id = :restaurantId")
    Double findAverageRatingByRestaurantId(@Param("restaurantId") Long restaurantId);
}
