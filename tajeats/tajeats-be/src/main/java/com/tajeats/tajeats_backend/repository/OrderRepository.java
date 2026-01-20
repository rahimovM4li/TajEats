package com.tajeats.tajeats_backend.repository;

import com.tajeats.tajeats_backend.model.Order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByRestaurantId(Long restaurantId);
    List<Order> findByStatus(String status);
    List<Order> findByCustomerNameContaining(String customerName);
    List<Order> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
    
    @Query("SELECT o FROM Order o WHERE o.status IN ('placed', 'preparing') AND o.restaurant.id = :restaurantId")
    List<Order> findActiveOrdersByRestaurant(@Param("restaurantId") Long restaurantId);
}

