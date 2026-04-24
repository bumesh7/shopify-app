package com.shopapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class ShopAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShopAppApplication.class, args);
    }
}
