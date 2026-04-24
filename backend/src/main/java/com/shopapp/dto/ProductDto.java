package com.shopapp.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

public class ProductDto {

    @Data
    public static class ProductResponse {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private BigDecimal discountPrice;
        private Integer stock;
        private String category;
        private String brand;
        private List<String> images;
        private String thumbnail;
        private Double rating;
        private Integer reviewCount;
        private Boolean featured;

        public static ProductResponse from(com.shopapp.model.Product p) {
            ProductResponse r = new ProductResponse();
            r.id = p.getId(); r.name = p.getName(); r.description = p.getDescription();
            r.price = p.getPrice(); r.discountPrice = p.getDiscountPrice();
            r.stock = p.getStock(); r.category = p.getCategory(); r.brand = p.getBrand();
            r.images = p.getImages(); r.thumbnail = p.getThumbnail();
            r.rating = p.getRating(); r.reviewCount = p.getReviewCount(); r.featured = p.getFeatured();
            return r;
        }
    }

    @Data
    public static class CreateProductRequest {
        private String name;
        private String description;
        private BigDecimal price;
        private BigDecimal discountPrice;
        private Integer stock;
        private String category;
        private String brand;
        private List<String> images;
        private String thumbnail;
        private Boolean featured = false;
    }
}
