package com.tajeats.tajeats_backend.service;

import com.tajeats.tajeats_backend.dto.RestaurantDTO;
import com.tajeats.tajeats_backend.exception.ResourceNotFoundException;
import com.tajeats.tajeats_backend.model.Restaurant;
import com.tajeats.tajeats_backend.repository.RestaurantRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    // ---------- DTO Mapping ----------
    private RestaurantDTO toDTO(Restaurant r) {
        RestaurantDTO dto = new RestaurantDTO();
        dto.setId(r.getId());
        dto.setName(r.getName());
        dto.setImage(r.getImage());
        dto.setLogo(r.getLogo());
        dto.setCategory(r.getCategory());
        dto.setRating(r.getRating() != null ? r.getRating().doubleValue() : null);
        dto.setReviewCount(r.getReviewCount());
        dto.setDeliveryTime(r.getDeliveryTime());
        dto.setDeliveryFee(r.getDeliveryFee());
        dto.setDescription(r.getDescription());
        dto.setIsOpen(r.getIsOpen());
        return dto;
    }

    private Restaurant toEntity(RestaurantDTO dto) {
        Restaurant r = new Restaurant();
        r.setId(dto.getId());
        r.setName(dto.getName());
        r.setImage(dto.getImage());
        r.setLogo(dto.getLogo());
        r.setCategory(dto.getCategory());
        r.setRating(dto.getRating() != null ? dto.getRating() : null);
        r.setReviewCount(dto.getReviewCount());
        r.setDeliveryTime(dto.getDeliveryTime());
        r.setDeliveryFee(dto.getDeliveryFee());
        r.setDescription(dto.getDescription());
        r.setIsOpen(dto.getIsOpen());
        return r;
    }

    // ---------- CRUD ----------
    public List<RestaurantDTO> getAll() {
        return restaurantRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public RestaurantDTO getById(Long id) {
        return restaurantRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
    }

    public RestaurantDTO create(RestaurantDTO dto) {
        Restaurant saved = restaurantRepository.save(toEntity(dto));
        return toDTO(saved);
    }

    public RestaurantDTO update(Long id, RestaurantDTO dto) {
        return restaurantRepository.findById(id).map(existing -> {
            existing.setName(dto.getName());
            existing.setImage(dto.getImage());
            existing.setLogo(dto.getLogo());
            existing.setCategory(dto.getCategory());
            existing.setRating(dto.getRating());
            existing.setReviewCount(dto.getReviewCount());
            existing.setDeliveryTime(dto.getDeliveryTime());
            existing.setDeliveryFee(dto.getDeliveryFee());
            existing.setDescription(dto.getDescription());
            existing.setIsOpen(dto.getIsOpen());
            return toDTO(existing);
        }).orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
    }

    public void delete(Long id) {
        restaurantRepository.deleteById(id);
    }
}
