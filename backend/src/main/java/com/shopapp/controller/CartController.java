package com.shopapp.controller;

import com.shopapp.dto.CartDto;
import com.shopapp.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDto.CartSummary> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    @PostMapping
    public ResponseEntity<CartDto.CartSummary> addToCart(@RequestBody CartDto.AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(request));
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<CartDto.CartSummary> updateQuantity(@PathVariable Long itemId,
                                                               @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(itemId, quantity));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<CartDto.CartSummary> removeItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeFromCart(itemId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.noContent().build();
    }
}
