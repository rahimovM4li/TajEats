package com.tajeats.tajeats_backend.controller;

import com.tajeats.tajeats_backend.dto.AuthResponse;
import com.tajeats.tajeats_backend.dto.LoginRequest;
import com.tajeats.tajeats_backend.dto.RegisterRequest;
import com.tajeats.tajeats_backend.dto.UserDTO;
import com.tajeats.tajeats_backend.exception.AccountPendingApprovalException;
import com.tajeats.tajeats_backend.exception.InvalidCredentialsException;
import com.tajeats.tajeats_backend.exception.UserAlreadyExistsException;
import com.tajeats.tajeats_backend.model.User;
import com.tajeats.tajeats_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            UserDTO user = userService.registerUser(request);
            
            // If restaurant owner, return message about pending approval
            if (user.getRole() == User.Role.RESTAURANT_OWNER) {
                Map<String, Object> response = new HashMap<>();
                response.put("user", user);
                response.put("message", "Registration successful! Please wait for admin approval before logging in.");
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            }
            
            // Customer and Rider accounts are auto-approved
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (UserAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // First check if user exists and get user info
            UserDTO user = userService.getUserByEmail(request.getEmail());
            
            // Check if restaurant owner is approved
            if (user.getRole() == User.Role.RESTAURANT_OWNER && !user.getIsApproved()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                        Map.of("error", "Account is pending admin approval",
                               "user", user)
                );
            }
            
            // Check if rider is approved
            if (user.getRole() == User.Role.RIDER && !user.getIsApproved()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                        Map.of("error", "Rider account is pending approval",
                               "user", user)
                );
            }
            
            // Authenticate and generate token
            String token = userService.authenticate(request.getEmail(), request.getPassword());
            
            AuthResponse response = new AuthResponse(token, user, null);
            return ResponseEntity.ok(response);
        } catch (InvalidCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            String email = authentication.getName();
            UserDTO user = userService.getUserByEmail(email);
            return ResponseEntity.ok(user);
        } catch (InvalidCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }
    
    // Temporary endpoint to generate password hash
    @GetMapping("/hash")
    public ResponseEntity<?> hashPassword(@RequestParam String password) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode(password);
        return ResponseEntity.ok(Map.of(
            "password", password,
            "hash", hash,
            "verification", encoder.matches(password, hash)
        ));
    }
}
