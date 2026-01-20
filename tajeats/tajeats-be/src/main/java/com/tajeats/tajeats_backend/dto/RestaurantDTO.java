package com.tajeats.tajeats_backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class RestaurantDTO {
    private Long id;
    private String name;
    private String image;
    private String logo;
    private String category;
    private Double rating;
    private Integer reviewCount;
    private String deliveryTime;
    private BigDecimal deliveryFee;
    private String description;
    private Boolean isOpen;
}
