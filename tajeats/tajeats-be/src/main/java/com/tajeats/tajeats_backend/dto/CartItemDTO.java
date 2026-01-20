package com.tajeats.tajeats_backend.dto;

import lombok.Data;

@Data
public class CartItemDTO {
    private Long id;
    private Long orderId;
    private Long dishId;
    private Integer quantity;
    private String sessionId;
}
