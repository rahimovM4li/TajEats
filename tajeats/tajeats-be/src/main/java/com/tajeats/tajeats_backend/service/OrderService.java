package com.tajeats.tajeats_backend.service;

import com.tajeats.tajeats_backend.dto.CartItemDTO;
import com.tajeats.tajeats_backend.dto.OrderDTO;
import com.tajeats.tajeats_backend.exception.ResourceNotFoundException;
import com.tajeats.tajeats_backend.model.CartItem;
import com.tajeats.tajeats_backend.model.Dish;
import com.tajeats.tajeats_backend.model.Order;
import com.tajeats.tajeats_backend.model.Restaurant;
import com.tajeats.tajeats_backend.repository.CartItemRepository;
import com.tajeats.tajeats_backend.repository.DishRepository;
import com.tajeats.tajeats_backend.repository.OrderRepository;
import com.tajeats.tajeats_backend.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final RestaurantRepository restaurantRepository;
    private final CartItemRepository cartItemRepository;
    private final DishRepository dishRepository;

    public OrderService(
            OrderRepository orderRepository,
            RestaurantRepository restaurantRepository,
            CartItemRepository cartItemRepository,
            DishRepository dishRepository
    ) {
        this.orderRepository = orderRepository;
        this.restaurantRepository = restaurantRepository;
        this.cartItemRepository = cartItemRepository;
        this.dishRepository = dishRepository;
    }

    // --------------------------- GET ALL --------------------------
    public List<OrderDTO> getAll() {
        return orderRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // --------------------------- GET BY ID -------------------------
    public OrderDTO getById(Long id) {
        return orderRepository.findById(id)
                .map(this::toDTO)
                .orElse(null);
    }

    // --------------------------- CREATE ----------------------------
    public OrderDTO create(OrderDTO dto) {

        Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        Order order = new Order();
        order.setRestaurant(restaurant);
        order.setRestaurantName(restaurant.getName());
        order.setCustomerName(dto.getCustomerName());
        order.setCustomerPhone(dto.getCustomerPhone());
        order.setCustomerAddress(dto.getCustomerAddress());
        order.setTotal(dto.getTotal());
        order.setStatus(dto.getStatus());
        order.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        order.setEstimatedDelivery(Timestamp.valueOf(LocalDateTime.now().plusMinutes(40)));

        order = orderRepository.save(order);

        // Save cart items
        if (dto.getItems() != null) {
            for (CartItemDTO itemDTO : dto.getItems()) {
                CartItem item = new CartItem();
                item.setOrder(order);

                Dish dish = dishRepository.findById(itemDTO.getDishId())
                        .orElseThrow(() -> new ResourceNotFoundException("Dish not found"));

                item.setDish(dish);
                item.setQuantity(itemDTO.getQuantity());

                cartItemRepository.save(item);
            }
        }

        return toDTO(orderRepository.findById(order.getId()).get());
    }

    // --------------------------- UPDATE ----------------------------
    public OrderDTO update(Long id, OrderDTO dto) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setCustomerName(dto.getCustomerName());
        order.setCustomerPhone(dto.getCustomerPhone());
        order.setCustomerAddress(dto.getCustomerAddress());
        order.setStatus(dto.getStatus());

        return toDTO(orderRepository.save(order));
    }

    // --------------------------- DELETE ----------------------------
    public void delete(Long id) {
        orderRepository.deleteById(id);
    }

    // --------------------------- MAPPER ----------------------------
    private OrderDTO toDTO(Order order) {
        OrderDTO dto = new OrderDTO();

        dto.setId(order.getId());
        dto.setRestaurantId(order.getRestaurant().getId());
        dto.setRestaurantName(order.getRestaurantName());
        dto.setCustomerName(order.getCustomerName());
        dto.setCustomerPhone(order.getCustomerPhone());
        dto.setCustomerAddress(order.getCustomerAddress());
        dto.setTotal(order.getTotal());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt().toLocalDateTime());
        dto.setEstimatedDelivery(order.getEstimatedDelivery().toLocalDateTime());

        if (order.getCartItems() != null) {
            dto.setItems(order.getCartItems().stream().map(item -> {
                CartItemDTO itemDTO = new CartItemDTO();
                itemDTO.setId(item.getId());
                itemDTO.setOrderId(order.getId());
                itemDTO.setDishId(item.getDish().getId());
                itemDTO.setQuantity(item.getQuantity());
                return itemDTO;
            }).collect(Collectors.toList()));
        }

        return dto;
    }
}
