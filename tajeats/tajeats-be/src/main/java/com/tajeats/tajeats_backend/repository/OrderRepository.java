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
    
    @Query("SELECT o FROM Order o WHERE o.status IN ('placed', 'approved', 'preparing', 'on-the-way') AND o.restaurant.id = :restaurantId")
    List<Order> findActiveOrdersByRestaurant(@Param("restaurantId") Long restaurantId);

    @Query("SELECT o FROM Order o WHERE o.deliveryType = 'DELIVERY' AND o.status = 'approved' AND o.restaurant.id = :restaurantId")
    List<Order> findDeliveryOrdersReadyForPickup(@Param("restaurantId") Long restaurantId);

    @Query("SELECT o FROM Order o WHERE o.deliveryType = 'DELIVERY' AND o.status IN ('approved', 'on-the-way') AND o.restaurant.id = :restaurantId")
    List<Order> findActiveDeliveryOrdersByRestaurant(@Param("restaurantId") Long restaurantId);
}

