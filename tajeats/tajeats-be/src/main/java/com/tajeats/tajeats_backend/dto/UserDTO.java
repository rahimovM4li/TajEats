package com.tajeats.tajeats_backend.dto;

import com.tajeats.tajeats_backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String name;
    private User.Role role;
    private Long restaurantId;
    private Boolean isApproved;
    private LocalDateTime createdAt;
}
