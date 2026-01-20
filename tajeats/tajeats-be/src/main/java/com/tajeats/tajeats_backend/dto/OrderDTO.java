package com.tajeats.tajeats_backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private Long id;
    private Long restaurantId;
    private String restaurantName;

    private String customerName;
    private String customerPhone;
    private String customerAddress;

    private BigDecimal total;
    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime estimatedDelivery;

    private List<CartItemDTO> items;
}
