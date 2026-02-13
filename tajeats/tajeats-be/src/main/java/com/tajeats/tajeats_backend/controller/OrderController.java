package com.tajeats.tajeats_backend.controller;

import com.tajeats.tajeats_backend.dto.OrderDTO;
import com.tajeats.tajeats_backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderDTO> getAllOrders() {
        return orderService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getById(id));
    }

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO dto) {
        return ResponseEntity.ok(orderService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable Long id, @RequestBody OrderDTO dto) {
        return ResponseEntity.ok(orderService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<OrderDTO> getOrdersByRestaurant(@PathVariable Long restaurantId) {
        return orderService.getByRestaurant(restaurantId);
    }

    @GetMapping("/restaurant/{restaurantId}/active")
    public List<OrderDTO> getActiveOrdersByRestaurant(@PathVariable Long restaurantId) {
        return orderService.getActiveByRestaurant(restaurantId);
    }

    @GetMapping("/restaurant/{restaurantId}/delivery")
    public List<OrderDTO> getDeliveryOrdersByRestaurant(@PathVariable Long restaurantId) {
        return orderService.getActiveDeliveryByRestaurant(restaurantId);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }
}
