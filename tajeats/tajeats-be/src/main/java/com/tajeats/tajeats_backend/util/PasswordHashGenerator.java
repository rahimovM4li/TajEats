package com.tajeats.tajeats_backend.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "Admin123!";
        String hash = encoder.encode(password);
        
        System.out.println("Password: " + password);
        System.out.println("BCrypt Hash: " + hash);
        
        // Verify the hash works
        boolean matches = encoder.matches(password, hash);
        System.out.println("Verification: " + matches);
        
        // Test the existing hash from init-admin.sql
        String existingHash = "$2a$10$Z8aR4JXvXqKWp8Jh1gJDKOYX9nqG0F5vZqz3wN7xL1M8yQ2bK4F.S";
        boolean existingMatches = encoder.matches(password, existingHash);
        System.out.println("Existing hash matches: " + existingMatches);
    }
}
