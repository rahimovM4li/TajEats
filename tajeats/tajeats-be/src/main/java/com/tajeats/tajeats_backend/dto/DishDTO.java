package com.tajeats.tajeats_backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DishDTO {
    private Long id;
    private Long restaurantId;

    private String name;
    private String description;
    private BigDecimal price;
    private String image;
    private String category;
    private Boolean isAvailable;
    private Boolean isPopular;
}
