package com.shopapp.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class CartDto {

    @Data
    public static class CartItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private String thumbnail;
        private BigDecimal price;
        private BigDecimal discountPrice;
        private Integer quantity;
        private BigDecimal subtotal;
        private Integer availableStock;

        public static CartItemResponse from(com.shopapp.model.CartItem item) {
            CartItemResponse r = new CartItemResponse();
            r.id = item.getId();
            r.productId = item.getProduct().getId();
            r.productName = item.getProduct().getName();
            r.thumbnail = item.getProduct().getThumbnail();
            r.price = item.getProduct().getPrice();
            r.discountPrice = item.getProduct().getDiscountPrice();
            r.quantity = item.getQuantity();
            BigDecimal unitPrice = r.discountPrice != null ? r.discountPrice : r.price;
            r.subtotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
            r.availableStock = item.getProduct().getStock();
            return r;
        }
    }

    @Data
    public static class AddToCartRequest {
        private Long productId;
        private Integer quantity = 1;
    }

    @Data
    public static class CartSummary {
        private List<CartItemResponse> items;
        private BigDecimal subtotal;
        private BigDecimal shipping;
        private BigDecimal tax;
        private BigDecimal total;
        private Integer itemCount;
    }
}
