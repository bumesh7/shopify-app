package com.shopapp.service;

import com.shopapp.dto.CartDto;
import com.shopapp.model.CartItem;
import com.shopapp.model.Product;
import com.shopapp.model.User;
import com.shopapp.repository.CartItemRepository;
import com.shopapp.repository.ProductRepository;
import com.shopapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    public CartDto.CartSummary getCart() {
        User user = currentUser();
        List<CartItem> items = cartItemRepository.findByUserId(user.getId());
        List<CartDto.CartItemResponse> itemResponses = items.stream()
                .map(CartDto.CartItemResponse::from).collect(Collectors.toList());

        BigDecimal subtotal = itemResponses.stream()
                .map(CartDto.CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal shipping = subtotal.compareTo(BigDecimal.valueOf(500)) >= 0
                ? BigDecimal.ZERO : BigDecimal.valueOf(49);
        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.18));
        BigDecimal total = subtotal.add(shipping).add(tax);

        CartDto.CartSummary summary = new CartDto.CartSummary();
        summary.setItems(itemResponses);
        summary.setSubtotal(subtotal);
        summary.setShipping(shipping);
        summary.setTax(tax);
        summary.setTotal(total);
        summary.setItemCount(items.stream().mapToInt(CartItem::getQuantity).sum());
        return summary;
    }

    @Transactional
    public CartDto.CartSummary addToCart(CartDto.AddToCartRequest request) {
        User user = currentUser();
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStock() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock");
        }

        cartItemRepository.findByUserIdAndProductId(user.getId(), product.getId())
                .ifPresentOrElse(item -> {
                    item.setQuantity(item.getQuantity() + request.getQuantity());
                    cartItemRepository.save(item);
                }, () -> {
                    CartItem newItem = CartItem.builder()
                            .user(user).product(product).quantity(request.getQuantity()).build();
                    cartItemRepository.save(newItem);
                });

        return getCart();
    }

    @Transactional
    public CartDto.CartSummary updateQuantity(Long itemId, Integer quantity) {
        User user = currentUser();
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        if (!item.getUser().getId().equals(user.getId())) throw new RuntimeException("Unauthorized");

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
        return getCart();
    }

    @Transactional
    public CartDto.CartSummary removeFromCart(Long itemId) {
        User user = currentUser();
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        if (!item.getUser().getId().equals(user.getId())) throw new RuntimeException("Unauthorized");
        cartItemRepository.delete(item);
        return getCart();
    }

    @Transactional
    public void clearCart() {
        cartItemRepository.deleteByUserId(currentUser().getId());
    }
}
