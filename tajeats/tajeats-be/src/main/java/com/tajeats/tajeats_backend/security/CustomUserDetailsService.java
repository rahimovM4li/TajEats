package com.tajeats.tajeats_backend.security;

import com.tajeats.tajeats_backend.model.User;
import com.tajeats.tajeats_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        // Check if user is approved (only for RESTAURANT_OWNER)
        if (user.getRole() == User.Role.RESTAURANT_OWNER && !user.getIsApproved()) {
            throw new UsernameNotFoundException("Account is pending admin approval");
        }
        
        // Check if rider is approved
        if (user.getRole() == User.Role.RIDER && !user.getIsApproved()) {
            throw new UsernameNotFoundException("Rider account is pending approval");
        }
        
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}
