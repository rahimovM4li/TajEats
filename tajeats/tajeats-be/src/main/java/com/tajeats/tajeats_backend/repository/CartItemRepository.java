package com.tajeats.tajeats_backend.repository;

import com.tajeats.tajeats_backend.model.CartItem;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByOrderId(Long orderId);
    List<CartItem> findBySessionId(String sessionId);
    void deleteBySessionId(String sessionId);
}
