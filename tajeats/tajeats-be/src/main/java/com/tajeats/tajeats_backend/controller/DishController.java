package com.tajeats.tajeats_backend.controller;

import com.tajeats.tajeats_backend.dto.DishDTO;
import com.tajeats.tajeats_backend.service.DishService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/dishes")
@CrossOrigin(origins = "*")
public class DishController {

    private final DishService dishService;

    public DishController(DishService dishService) {
        this.dishService = dishService;
    }

    @GetMapping
    public List<DishDTO> getAllDishes(@RequestParam(required = false) Long restaurantId) {
        if (restaurantId != null) {
            return dishService.getByRestaurant(restaurantId);
        }
        return dishService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DishDTO> getDish(@PathVariable Long id) {
        return ResponseEntity.ok(dishService.getById(id));
    }

    @PostMapping
    public ResponseEntity<DishDTO> createDish(@RequestBody DishDTO dto) {
        return ResponseEntity.ok(dishService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DishDTO> updateDish(@PathVariable Long id, @RequestBody DishDTO dto) {
        return ResponseEntity.ok(dishService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDish(@PathVariable Long id) {
        dishService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
