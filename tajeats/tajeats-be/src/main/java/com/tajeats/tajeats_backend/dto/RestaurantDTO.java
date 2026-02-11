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
    private BigDecimal minOrder;
    private String description;
    private Boolean isOpen;

    // Address
    private String street;
    private String houseNumber;
    private String postalCode;
    private String city;

    // Contact
    private String phone;
    private String email;
    private String website;

    // Delivery mode: DELIVERY, PICKUP, BOTH
    private String deliveryMode;

    // Opening hours per weekday (e.g. "09:00-22:00", null = closed)
    private String openingMonday;
    private String openingTuesday;
    private String openingWednesday;
    private String openingThursday;
    private String openingFriday;
    private String openingSaturday;
    private String openingSunday;
}
