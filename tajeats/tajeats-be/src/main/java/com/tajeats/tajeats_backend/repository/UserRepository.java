package com.tajeats.tajeats_backend.repository;

import com.tajeats.tajeats_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByRoleAndIsApproved(User.Role role, Boolean isApproved);

    List<User> findByRoleAndRestaurantId(User.Role role, Long restaurantId);
}
