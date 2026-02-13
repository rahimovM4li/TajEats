package com.tajeats.tajeats_backend.service;

import com.tajeats.tajeats_backend.dto.RestaurantDTO;
import com.tajeats.tajeats_backend.exception.ResourceNotFoundException;
import com.tajeats.tajeats_backend.model.DeliveryMode;
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
        dto.setMinOrder(r.getMinOrder());
        dto.setDescription(r.getDescription());
        dto.setIsOpen(r.getIsOpen());

        // Address
        dto.setStreet(r.getStreet());
        dto.setHouseNumber(r.getHouseNumber());
        dto.setPostalCode(r.getPostalCode());
        dto.setCity(r.getCity());

        // Contact
        dto.setPhone(r.getPhone());
        dto.setEmail(r.getEmail());
        dto.setWebsite(r.getWebsite());

        // Delivery mode
        dto.setDeliveryMode(r.getDeliveryMode() != null ? r.getDeliveryMode().name() : null);

        // Opening hours
        dto.setOpeningMonday(r.getOpeningMonday());
        dto.setOpeningTuesday(r.getOpeningTuesday());
        dto.setOpeningWednesday(r.getOpeningWednesday());
        dto.setOpeningThursday(r.getOpeningThursday());
        dto.setOpeningFriday(r.getOpeningFriday());
        dto.setOpeningSaturday(r.getOpeningSaturday());
        dto.setOpeningSunday(r.getOpeningSunday());

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
        r.setMinOrder(dto.getMinOrder());
        r.setDescription(dto.getDescription());
        r.setIsOpen(dto.getIsOpen());

        // Address
        r.setStreet(dto.getStreet());
        r.setHouseNumber(dto.getHouseNumber());
        r.setPostalCode(dto.getPostalCode());
        r.setCity(dto.getCity());

        // Contact
        r.setPhone(dto.getPhone());
        r.setEmail(dto.getEmail());
        r.setWebsite(dto.getWebsite());

        // Delivery mode
        if (dto.getDeliveryMode() != null) {
            r.setDeliveryMode(DeliveryMode.valueOf(dto.getDeliveryMode()));
        }

        // Opening hours
        r.setOpeningMonday(dto.getOpeningMonday());
        r.setOpeningTuesday(dto.getOpeningTuesday());
        r.setOpeningWednesday(dto.getOpeningWednesday());
        r.setOpeningThursday(dto.getOpeningThursday());
        r.setOpeningFriday(dto.getOpeningFriday());
        r.setOpeningSaturday(dto.getOpeningSaturday());
        r.setOpeningSunday(dto.getOpeningSunday());

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
            existing.setMinOrder(dto.getMinOrder());
            existing.setDescription(dto.getDescription());
            existing.setIsOpen(dto.getIsOpen());

            // Address
            existing.setStreet(dto.getStreet());
            existing.setHouseNumber(dto.getHouseNumber());
            existing.setPostalCode(dto.getPostalCode());
            existing.setCity(dto.getCity());

            // Contact
            existing.setPhone(dto.getPhone());
            existing.setEmail(dto.getEmail());
            existing.setWebsite(dto.getWebsite());

            // Delivery mode
            if (dto.getDeliveryMode() != null) {
                existing.setDeliveryMode(DeliveryMode.valueOf(dto.getDeliveryMode()));
            }

            // Opening hours
            existing.setOpeningMonday(dto.getOpeningMonday());
            existing.setOpeningTuesday(dto.getOpeningTuesday());
            existing.setOpeningWednesday(dto.getOpeningWednesday());
            existing.setOpeningThursday(dto.getOpeningThursday());
            existing.setOpeningFriday(dto.getOpeningFriday());
            existing.setOpeningSaturday(dto.getOpeningSaturday());
            existing.setOpeningSunday(dto.getOpeningSunday());

            return toDTO(existing);
        }).orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
    }

    public void delete(Long id) {
        restaurantRepository.deleteById(id);
    }
}
