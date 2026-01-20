package com.tajeats.tajeats_backend.dto;

import lombok.Data;

@Data
public class CartItemResponseDTO {
    private Long id;
    private String sessionId;
    private DishDTO dish;
    private Integer quantity;
}
