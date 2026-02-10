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
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Boolean isOpen;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Dish> dishes;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

}
