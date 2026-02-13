package com.tajeats.tajeats_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "restaurants")
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String image;
    
    @Column(columnDefinition = "TEXT")
    private String logo;
    
    private String category;
    private Double rating;
    private Integer reviewCount;
    private String deliveryTime;
    private BigDecimal deliveryFee;
    private BigDecimal minOrder;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Boolean isOpen;

    // Address fields
    private String street;
    private String houseNumber;
    private String postalCode;
    private String city;

    // Contact fields
    private String phone;
    private String email;
    private String website;

    // Delivery mode
    @Enumerated(EnumType.STRING)
    private DeliveryMode deliveryMode;

    // Opening hours (simple per-day, e.g. "09:00-22:00" or null/empty for closed)
    private String openingMonday;
    private String openingTuesday;
    private String openingWednesday;
    private String openingThursday;
    private String openingFriday;
    private String openingSaturday;
    private String openingSunday;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Dish> dishes;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

}
