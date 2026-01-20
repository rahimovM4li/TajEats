package com.tajeats.tajeats_backend.dto;

import lombok.Data;

import java.time.LocalDate;


@Data
public class ReviewDTO {
    private Long id;
    private Long restaurantId;

    private String userName;
    private String userAvatar;
    private Integer rating;
    private String comment;
    private LocalDate date;
}
