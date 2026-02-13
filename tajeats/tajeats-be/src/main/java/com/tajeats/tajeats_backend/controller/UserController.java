package com.tajeats.tajeats_backend.controller;

import com.tajeats.tajeats_backend.dto.UserDTO;
import com.tajeats.tajeats_backend.exception.InvalidCredentialsException;
import com.tajeats.tajeats_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getPendingUsers() {
        List<UserDTO> pendingUsers = userService.getPendingUsers();
        return ResponseEntity.ok(pendingUsers);
    }
    
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        try {
            UserDTO user = userService.approveUser(id);
            return ResponseEntity.ok(user);
        } catch (InvalidCredentialsException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectUser(@PathVariable Long id) {
        try {
            userService.rejectUser(id);
            return ResponseEntity.ok(Map.of("message", "User rejected and removed successfully"));
        } catch (InvalidCredentialsException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{userId}/restaurant/{restaurantId}")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'RIDER')")
    public ResponseEntity<?> linkRestaurantToUser(@PathVariable Long userId, @PathVariable Long restaurantId) {
        try {
            UserDTO user = userService.linkRestaurant(userId, restaurantId);
            return ResponseEntity.ok(user);
        } catch (InvalidCredentialsException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/riders/restaurant/{restaurantId}")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
    public ResponseEntity<List<UserDTO>> getRidersByRestaurant(@PathVariable Long restaurantId) {
        List<UserDTO> riders = userService.getRidersByRestaurant(restaurantId);
        return ResponseEntity.ok(riders);
    }
}
