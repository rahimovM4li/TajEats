package com.tajeats.tajeats_backend.service;

import com.tajeats.tajeats_backend.dto.CartItemDTO;
import com.tajeats.tajeats_backend.dto.CartItemResponseDTO;
import com.tajeats.tajeats_backend.dto.DishDTO;
import com.tajeats.tajeats_backend.exception.ResourceNotFoundException;
import com.tajeats.tajeats_backend.model.CartItem;
import com.tajeats.tajeats_backend.model.Dish;
import com.tajeats.tajeats_backend.model.Order;
import com.tajeats.tajeats_backend.repository.CartItemRepository;
import com.tajeats.tajeats_backend.repository.DishRepository;
import com.tajeats.tajeats_backend.repository.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartItemService {

    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final DishRepository dishRepository;
    private final DishService dishService;

    public CartItemService(
            CartItemRepository cartItemRepository,
            OrderRepository orderRepository,
            DishRepository dishRepository,
            DishService dishService
    ) {
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.dishRepository = dishRepository;
        this.dishService = dishService;
    }

    // --------------------------- GET ALL --------------------------
    public List<CartItemDTO> getAll() {
        return cartItemRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // --------------------------- GET BY ID -------------------------
    public CartItemDTO getById(Long id) {
        return cartItemRepository.findById(id)
                .map(this::toDTO)
                .orElse(null);
    }

    // --------------------------- CREATE ----------------------------
    public CartItemDTO create(CartItemDTO dto) {

        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        Dish dish = dishRepository.findById(dto.getDishId())
                .orElseThrow(() -> new ResourceNotFoundException("Dish not found"));

        CartItem item = new CartItem();
        item.setOrder(order);
        item.setDish(dish);
        item.setQuantity(dto.getQuantity());

        return toDTO(cartItemRepository.save(item));
    }

    // --------------------------- UPDATE ----------------------------
    public CartItemDTO update(Long id, CartItemDTO dto) {
        CartItem item = cartItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        item.setQuantity(dto.getQuantity());

        if (dto.getDishId() != null) {
            Dish dish = dishRepository.findById(dto.getDishId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dish not found"));
            item.setDish(dish);
        }

        return toDTO(cartItemRepository.save(item));
    }

    // --------------------------- DELETE ----------------------------
    public void delete(Long id) {
        cartItemRepository.deleteById(id);
    }
    
    // --------------------------- SESSION-BASED CART ----------------------------
    public List<CartItemResponseDTO> getCartBySession(String sessionId) {
        return cartItemRepository.findBySessionId(sessionId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    public CartItemResponseDTO addToSessionCart(String sessionId, Long dishId, Integer quantity) {
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new ResourceNotFoundException("Dish not found"));
        
        // Check if item already exists in session cart
        List<CartItem> existingItems = cartItemRepository.findBySessionId(sessionId);
        for (CartItem item : existingItems) {
            if (item.getDish().getId().equals(dishId)) {
                // Update quantity
                item.setQuantity(item.getQuantity() + quantity);
                return toResponseDTO(cartItemRepository.save(item));
            }
        }
        
        // Create new item
        CartItem item = new CartItem();
        item.setSessionId(sessionId);
        item.setDish(dish);
        item.setQuantity(quantity);
        item.setOrder(null); // No order yet, this is pre-order cart
        
        return toResponseDTO(cartItemRepository.save(item));
    }
    
    public void clearSessionCart(String sessionId) {
        cartItemRepository.deleteBySessionId(sessionId);
    }

    // --------------------------- MAPPER ----------------------------
    private CartItemDTO toDTO(CartItem item) {
        CartItemDTO dto = new CartItemDTO();
        dto.setId(item.getId());
        if (item.getOrder() != null) {
            dto.setOrderId(item.getOrder().getId());
        }
        dto.setDishId(item.getDish().getId());
        dto.setQuantity(item.getQuantity());
        dto.setSessionId(item.getSessionId());
        return dto;
    }
    
    private CartItemResponseDTO toResponseDTO(CartItem item) {
        CartItemResponseDTO dto = new CartItemResponseDTO();
        dto.setId(item.getId());
        dto.setSessionId(item.getSessionId());
        dto.setQuantity(item.getQuantity());
        
        // Embed full dish data
        DishDTO dishDTO = dishService.getById(item.getDish().getId());
        dto.setDish(dishDTO);
        
        return dto;
    }
}
