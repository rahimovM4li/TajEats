package com.tajeats.tajeats_backend.service;

import com.tajeats.tajeats_backend.dto.RegisterRequest;
import com.tajeats.tajeats_backend.dto.UserDTO;
import com.tajeats.tajeats_backend.exception.AccountPendingApprovalException;
import com.tajeats.tajeats_backend.exception.InvalidCredentialsException;
import com.tajeats.tajeats_backend.exception.UserAlreadyExistsException;
import com.tajeats.tajeats_backend.model.User;
import com.tajeats.tajeats_backend.repository.UserRepository;
import com.tajeats.tajeats_backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    
    public UserDTO registerUser(RegisterRequest request) {
        // Validate email uniqueness
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered");
        }
        
        // Validate role (only RESTAURANT_OWNER or CUSTOMER allowed)
        if (request.getRole() == User.Role.ADMIN) {
            throw new IllegalArgumentException("Cannot register as ADMIN through this endpoint");
        }
        
        // Create user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setRole(request.getRole());
        
        // Set approval status: CUSTOMER = auto-approved, RESTAURANT_OWNER = needs approval
        user.setIsApproved(request.getRole() == User.Role.CUSTOMER);
        
        User savedUser = userRepository.save(user);
        return toDTO(savedUser);
    }
    
    public String authenticate(String email, String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            
            // If authentication successful, generate token
            org.springframework.security.core.userdetails.UserDetails userDetails =
                    (org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal();
            
            return jwtUtil.generateToken(userDetails);
        } catch (AuthenticationException e) {
            throw new InvalidCredentialsException("Invalid email or password");
        }
    }
    
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));
        return toDTO(user);
    }
    
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));
        return toDTO(user);
    }
    
    public List<UserDTO> getPendingUsers() {
        return userRepository.findByRoleAndIsApproved(User.Role.RESTAURANT_OWNER, false)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public UserDTO approveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));
        
        user.setIsApproved(true);
        User savedUser = userRepository.save(user);
        return toDTO(savedUser);
    }
    
    public void rejectUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));
        
        userRepository.delete(user);
    }
    
    public UserDTO linkRestaurant(Long userId, Long restaurantId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));
        
        user.setRestaurantId(restaurantId);
        User savedUser = userRepository.save(user);
        return toDTO(savedUser);
    }
    
    private UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setRole(user.getRole());
        dto.setRestaurantId(user.getRestaurantId());
        dto.setIsApproved(user.getIsApproved());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
