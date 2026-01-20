package com.tajeats.tajeats_backend.repository;

import com.tajeats.tajeats_backend.model.Restaurant;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByCategory(String category);
    List<Restaurant> findByIsOpenTrue();
    List<Restaurant> findByNameContainingIgnoreCase(String name);
    List<Restaurant> findByRatingGreaterThanEqual(Double minRating);
}
