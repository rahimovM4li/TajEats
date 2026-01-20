package com.tajeats.tajeats_backend.service;

import com.tajeats.tajeats_backend.dto.DishDTO;
import com.tajeats.tajeats_backend.exception.ResourceNotFoundException;
import com.tajeats.tajeats_backend.model.Dish;
import com.tajeats.tajeats_backend.model.Restaurant;
import com.tajeats.tajeats_backend.repository.DishRepository;
import com.tajeats.tajeats_backend.repository.RestaurantRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DishService {

    private final DishRepository dishRepository;
    private final RestaurantRepository restaurantRepository;

    // ---------- DTO Mapping ----------
    private DishDTO toDTO(Dish d) {
        DishDTO dto = new DishDTO();
        dto.setId(d.getId());
        dto.setRestaurantId(d.getRestaurant().getId());
        dto.setName(d.getName());
        dto.setDescription(d.getDescription());
        dto.setPrice(d.getPrice());
        dto.setImage(d.getImage());
        dto.setCategory(d.getCategory());
        dto.setIsAvailable(d.getIsAvailable());
        dto.setIsPopular(d.getIsPopular());
        return dto;
    }

    private Dish toEntity(DishDTO dto) {
        Dish d = new Dish();
        d.setId(dto.getId());
        d.setName(dto.getName());
        d.setDescription(dto.getDescription());
        d.setPrice(dto.getPrice());
        d.setImage(dto.getImage());
        d.setCategory(dto.getCategory());
        d.setIsAvailable(dto.getIsAvailable());
        d.setIsPopular(dto.getIsPopular());

        Restaurant r = restaurantRepository.findById(dto.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        d.setRestaurant(r);

        return d;
    }

    // ---------- CRUD ----------
    public List<DishDTO> getAll() {
        return dishRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public DishDTO getById(Long id) {
        return dishRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Dish not found"));
    }

    public DishDTO create(DishDTO dto) {
        Dish saved = dishRepository.save(toEntity(dto));
        return toDTO(saved);
    }

    public DishDTO update(Long id, DishDTO dto) {
        return dishRepository.findById(id).map(existing -> {

            existing.setName(dto.getName());
            existing.setDescription(dto.getDescription());
            existing.setPrice(dto.getPrice());
            existing.setImage(dto.getImage());
            existing.setCategory(dto.getCategory());
            existing.setIsAvailable(dto.getIsAvailable());
            existing.setIsPopular(dto.getIsPopular());

            Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
            existing.setRestaurant(restaurant);

            return toDTO(existing);

        }).orElseThrow(() -> new ResourceNotFoundException("Dish not found"));
    }

    public void delete(Long id) {
        dishRepository.deleteById(id);
    }
    
    // ---------- Custom Queries ----------
    public List<DishDTO> getByRestaurant(Long restaurantId) {
        return dishRepository.findByRestaurantId(restaurantId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
