package com.shopapp.service;

import com.shopapp.dto.ProductDto;
import com.shopapp.model.Product;
import com.shopapp.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Cacheable(value = "products", key = "#page + '-' + #size + '-' + #category + '-' + #sort")
    public Page<ProductDto.ProductResponse> getProducts(int page, int size, String category, String sort) {
        Pageable pageable = PageRequest.of(page, size, parseSort(sort));
        Page<Product> products = category != null && !category.isEmpty()
                ? productRepository.findByCategoryAndActiveTrue(category, pageable)
                : productRepository.findByActiveTrue(pageable);
        return products.map(ProductDto.ProductResponse::from);
    }

    public Page<ProductDto.ProductResponse> searchProducts(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.searchProducts(query, pageable).map(ProductDto.ProductResponse::from);
    }

    public ProductDto.ProductResponse getProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return ProductDto.ProductResponse.from(product);
    }

    public List<ProductDto.ProductResponse> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrue()
                .stream().map(ProductDto.ProductResponse::from).collect(Collectors.toList());
    }

    public List<String> getCategories() {
        return productRepository.findAllCategories();
    }

    @CacheEvict(value = "products", allEntries = true)
    public ProductDto.ProductResponse createProduct(ProductDto.CreateProductRequest request) {
        Product product = Product.builder()
                .name(request.getName()).description(request.getDescription())
                .price(request.getPrice()).discountPrice(request.getDiscountPrice())
                .stock(request.getStock()).category(request.getCategory())
                .brand(request.getBrand()).images(request.getImages())
                .thumbnail(request.getThumbnail()).featured(request.getFeatured())
                .active(true).rating(0.0).reviewCount(0)
                .build();
        return ProductDto.ProductResponse.from(productRepository.save(product));
    }

    @CacheEvict(value = "products", allEntries = true)
    public ProductDto.ProductResponse updateProduct(Long id, ProductDto.CreateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setName(request.getName()); product.setDescription(request.getDescription());
        product.setPrice(request.getPrice()); product.setDiscountPrice(request.getDiscountPrice());
        product.setStock(request.getStock()); product.setCategory(request.getCategory());
        product.setBrand(request.getBrand()); product.setImages(request.getImages());
        product.setThumbnail(request.getThumbnail()); product.setFeatured(request.getFeatured());
        return ProductDto.ProductResponse.from(productRepository.save(product));
    }

    @CacheEvict(value = "products", allEntries = true)
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setActive(false);
        productRepository.save(product);
    }

    private Sort parseSort(String sort) {
        if (sort == null) return Sort.by("createdAt").descending();
        return switch (sort) {
            case "price_asc" -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "rating" -> Sort.by("rating").descending();
            case "newest" -> Sort.by("createdAt").descending();
            default -> Sort.by("createdAt").descending();
        };
    }
}
