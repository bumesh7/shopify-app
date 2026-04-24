package com.shopapp.service;

import com.shopapp.dto.OrderDto;
import com.shopapp.model.*;
import com.shopapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    @Transactional
    public OrderDto.OrderResponse placeOrder(OrderDto.PlaceOrderRequest request) {
        User user = currentUser();
        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
        if (cartItems.isEmpty()) throw new RuntimeException("Cart is empty");

        Address address = addressRepository.findById(request.getShippingAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem ci : cartItems) {
            BigDecimal unitPrice = ci.getProduct().getDiscountPrice() != null
                    ? ci.getProduct().getDiscountPrice() : ci.getProduct().getPrice();
            subtotal = subtotal.add(unitPrice.multiply(BigDecimal.valueOf(ci.getQuantity())));
        }

        BigDecimal shipping = subtotal.compareTo(BigDecimal.valueOf(500)) >= 0
                ? BigDecimal.ZERO : BigDecimal.valueOf(49);
        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.18));
        BigDecimal total = subtotal.add(shipping).add(tax);

        Order order = Order.builder()
                .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .user(user).shippingAddress(address)
                .subtotal(subtotal).shippingCost(shipping).tax(tax).total(total)
                .paymentMethod(request.getPaymentMethod()).notes(request.getNotes())
                .status(Order.Status.PENDING).paymentStatus(Order.PaymentStatus.PENDING)
                .build();
        order = orderRepository.save(order);

        final Order savedOrder = order;
        List<OrderItem> orderItems = cartItems.stream().map(ci -> {
            BigDecimal unitPrice = ci.getProduct().getDiscountPrice() != null
                    ? ci.getProduct().getDiscountPrice() : ci.getProduct().getPrice();
            Product p = ci.getProduct();
            p.setStock(p.getStock() - ci.getQuantity());
            productRepository.save(p);
            return OrderItem.builder()
                    .order(savedOrder).product(p).quantity(ci.getQuantity())
                    .unitPrice(unitPrice)
                    .totalPrice(unitPrice.multiply(BigDecimal.valueOf(ci.getQuantity())))
                    .build();
        }).collect(Collectors.toList());

        savedOrder.setItems(orderItems);
        orderRepository.save(savedOrder);
        cartItemRepository.deleteByUserId(user.getId());

        return OrderDto.OrderResponse.from(savedOrder);
    }

    public Page<OrderDto.OrderResponse> getUserOrders(int page, int size) {
        User user = currentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(OrderDto.OrderResponse::from);
    }

    public OrderDto.OrderResponse getOrder(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return OrderDto.OrderResponse.from(order);
    }

    @Transactional
    public OrderDto.OrderResponse updateStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(Order.Status.valueOf(status));
        return OrderDto.OrderResponse.from(orderRepository.save(order));
    }
}
