package com.tajeats.tajeats_backend.dto;

import com.tajeats.tajeats_backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private User.Role role; // RESTAURANT_OWNER, CUSTOMER, or RIDER allowed
}
