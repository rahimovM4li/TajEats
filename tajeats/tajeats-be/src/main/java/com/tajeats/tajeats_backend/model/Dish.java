package com.tajeats.tajeats_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "dishes")
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;

    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private BigDecimal price;
    
    @Column(columnDefinition = "TEXT")
    private String image;
    
    private String category;
    private Boolean isAvailable;
    private Boolean isPopular;
}
