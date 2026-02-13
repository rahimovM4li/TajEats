package com.tajeats.tajeats_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;

    private String restaurantName;
    private String customerName;
    private String customerPhone;
    private String customerAddress;
    private BigDecimal total;
    private String status;
    private String deliveryType; // DELIVERY or PICKUP
    private Timestamp createdAt;
    private Timestamp estimatedDelivery;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<CartItem> cartItems;
}
