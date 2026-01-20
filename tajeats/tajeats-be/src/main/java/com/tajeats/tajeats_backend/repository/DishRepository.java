package com.tajeats.tajeats_backend.repository;

import com.tajeats.tajeats_backend.model.Dish;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DishRepository extends JpaRepository<Dish, Long> {
    List<Dish> findByRestaurantId(Long restaurantId);
    List<Dish> findByIsAvailableTrue();
    List<Dish> findByIsPopularTrue();
    List<Dish> findByCategory(String category);
    List<Dish> findByRestaurantIdAndIsAvailableTrue(Long restaurantId);
}