package com.tajeats.tajeats_backend.controller;

import com.tajeats.tajeats_backend.dto.CartItemDTO;
import com.tajeats.tajeats_backend.dto.CartItemResponseDTO;
import com.tajeats.tajeats_backend.service.CartItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartItemController {

    private final CartItemService cartItemService;

    public CartItemController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }

    @GetMapping
    public List<CartItemDTO> getCartItems() {
        return cartItemService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartItemDTO> getCartItem(@PathVariable Long id) {
        return ResponseEntity.ok(cartItemService.getById(id));
    }

    @PostMapping
    public ResponseEntity<CartItemDTO> createCartItem(@RequestBody CartItemDTO dto) {
        return ResponseEntity.ok(cartItemService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItemDTO> updateCartItem(@PathVariable Long id, @RequestBody CartItemDTO dto) {
        return ResponseEntity.ok(cartItemService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable Long id) {
        cartItemService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    // --------------------------- SESSION-BASED CART ENDPOINTS ----------------------------
    
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<CartItemResponseDTO>> getSessionCart(
            @PathVariable String sessionId
    ) {
        return ResponseEntity.ok(cartItemService.getCartBySession(sessionId));
    }
    
    @PostMapping("/session/{sessionId}")
    public ResponseEntity<CartItemResponseDTO> addToSessionCart(
            @PathVariable String sessionId,
            @RequestBody Map<String, Object> payload
    ) {
        Long dishId = Long.valueOf(payload.get("dishId").toString());
        Integer quantity = Integer.valueOf(payload.get("quantity").toString());
        
        return ResponseEntity.ok(cartItemService.addToSessionCart(sessionId, dishId, quantity));
    }
    
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Void> clearSessionCart(@PathVariable String sessionId) {
        cartItemService.clearSessionCart(sessionId);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/session/{sessionId}/item/{itemId}")
    public ResponseEntity<Void> removeItemFromSessionCart(
            @PathVariable String sessionId,
            @PathVariable Long itemId
    ) {
        cartItemService.delete(itemId);
        return ResponseEntity.noContent().build();
    }
}
