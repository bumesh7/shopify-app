package com.shopapp.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class OrderDto {

    @Data
    public static class PlaceOrderRequest {
        private Long shippingAddressId;
        private String paymentMethod;
        private String notes;
    }

    @Data
    public static class OrderItemResponse {
        private Long productId;
        private String productName;
        private String thumbnail;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;

        public static OrderItemResponse from(com.shopapp.model.OrderItem item) {
            OrderItemResponse r = new OrderItemResponse();
            r.productId = item.getProduct().getId();
            r.productName = item.getProduct().getName();
            r.thumbnail = item.getProduct().getThumbnail();
            r.quantity = item.getQuantity();
            r.unitPrice = item.getUnitPrice();
            r.totalPrice = item.getTotalPrice();
            return r;
        }
    }

    @Data
    public static class OrderResponse {
        private Long id;
        private String orderNumber;
        private List<OrderItemResponse> items;
        private BigDecimal subtotal;
        private BigDecimal shippingCost;
        private BigDecimal tax;
        private BigDecimal total;
        private String status;
        private String paymentStatus;
        private String paymentMethod;
        private String trackingNumber;
        private LocalDateTime createdAt;
        private LocalDateTime deliveredAt;

        public static OrderResponse from(com.shopapp.model.Order o) {
            OrderResponse r = new OrderResponse();
            r.id = o.getId(); r.orderNumber = o.getOrderNumber();
            r.items = o.getItems().stream().map(OrderItemResponse::from).collect(Collectors.toList());
            r.subtotal = o.getSubtotal(); r.shippingCost = o.getShippingCost();
            r.tax = o.getTax(); r.total = o.getTotal();
            r.status = o.getStatus().name(); r.paymentStatus = o.getPaymentStatus().name();
            r.paymentMethod = o.getPaymentMethod(); r.trackingNumber = o.getTrackingNumber();
            r.createdAt = o.getCreatedAt(); r.deliveredAt = o.getDeliveredAt();
            return r;
        }
    }
}
