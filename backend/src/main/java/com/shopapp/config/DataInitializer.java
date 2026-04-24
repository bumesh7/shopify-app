package com.shopapp.config;

import com.shopapp.model.Product;
import com.shopapp.model.User;
import com.shopapp.repository.ProductRepository;
import com.shopapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) seedUsers();
        if (productRepository.count() == 0) seedProducts();
    }

    private void seedUsers() {
        User admin = User.builder()
                .email("admin@shopapp.com").password(passwordEncoder.encode("admin123"))
                .firstName("Admin").lastName("User").role(User.Role.ADMIN).active(true).build();
        User user = User.builder()
                .email("user@shopapp.com").password(passwordEncoder.encode("user123"))
                .firstName("John").lastName("Doe").role(User.Role.USER).active(true).build();
        userRepository.saveAll(List.of(admin, user));
        log.info("Seeded users: admin@shopapp.com / admin123 | user@shopapp.com / user123");
    }

    private void seedProducts() {
        List<Product> products = List.of(
            Product.builder().name("Wireless Noise-Cancelling Headphones").description("Premium audio experience with 30hr battery life, adaptive noise cancellation and spatial audio.").price(new BigDecimal("2999")).discountPrice(new BigDecimal("2499")).stock(50).category("Electronics").brand("SoundPro").thumbnail("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400").images(List.of("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800")).rating(4.8).reviewCount(234).featured(true).active(true).build(),
            Product.builder().name("Premium Leather Sneakers").description("Handcrafted Italian leather sneakers with memory foam insoles. Available in multiple colorways.").price(new BigDecimal("4500")).discountPrice(new BigDecimal("3799")).stock(30).category("Fashion").brand("UrbanStep").thumbnail("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400").images(List.of("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800")).rating(4.6).reviewCount(189).featured(true).active(true).build(),
            Product.builder().name("Smart Watch Pro").description("Health tracking, GPS, AMOLED display, 7-day battery. Water resistant to 50m.").price(new BigDecimal("8999")).discountPrice(new BigDecimal("7499")).stock(25).category("Electronics").brand("TechWear").thumbnail("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400").images(List.of("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800")).rating(4.7).reviewCount(312).featured(true).active(true).build(),
            Product.builder().name("Minimalist Backpack 25L").description("Weatherproof 25L backpack with laptop compartment, USB-C port and ergonomic straps.").price(new BigDecimal("3200")).discountPrice(null).stock(60).category("Bags").brand("UrbanCarry").thumbnail("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400").images(List.of("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800")).rating(4.5).reviewCount(98).featured(false).active(true).build(),
            Product.builder().name("Mechanical Keyboard TKL").description("Tenkeyless mechanical keyboard with Cherry MX switches, RGB backlighting and aluminium frame.").price(new BigDecimal("6500")).discountPrice(new BigDecimal("5499")).stock(20).category("Electronics").brand("KeyMaster").thumbnail("https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400").images(List.of("https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800")).rating(4.9).reviewCount(445).featured(true).active(true).build(),
            Product.builder().name("Linen Shirt — Slate Blue").description("Breathable 100% linen shirt with a relaxed fit. Perfect for summer and travel.").price(new BigDecimal("1800")).discountPrice(new BigDecimal("1299")).stock(80).category("Fashion").brand("Loom & Co").thumbnail("https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400").images(List.of("https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800")).rating(4.4).reviewCount(67).featured(false).active(true).build(),
            Product.builder().name("Ergonomic Office Chair").description("Lumbar support, adjustable armrests, mesh back. 8-hour comfort certified. Ships assembled.").price(new BigDecimal("18000")).discountPrice(new BigDecimal("14999")).stock(15).category("Furniture").brand("ErgoSeat").thumbnail("https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400").images(List.of("https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800")).rating(4.6).reviewCount(203).featured(true).active(true).build(),
            Product.builder().name("Stainless Steel Water Bottle 1L").description("Triple-wall vacuum insulated. Keeps drinks cold 48hrs, hot 24hrs. BPA-free.").price(new BigDecimal("1200")).discountPrice(null).stock(100).category("Lifestyle").brand("HydroCore").thumbnail("https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400").images(List.of("https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800")).rating(4.7).reviewCount(521).featured(false).active(true).build(),
            Product.builder().name("Wireless Charging Pad").description("15W fast wireless charger compatible with all Qi devices. Ultra-slim 5mm profile.").price(new BigDecimal("1499")).discountPrice(new BigDecimal("999")).stock(75).category("Electronics").brand("ChargeTech").thumbnail("https://images.unsplash.com/photo-1586495777744-4e6232bf2177?w=400").images(List.of("https://images.unsplash.com/photo-1586495777744-4e6232bf2177?w=800")).rating(4.3).reviewCount(156).featured(false).active(true).build(),
            Product.builder().name("Yoga Mat Premium").description("Extra-thick 6mm non-slip yoga mat with alignment lines, carrying strap and moisture-resistant surface.").price(new BigDecimal("2200")).discountPrice(new BigDecimal("1799")).stock(45).category("Sports").brand("ZenFlex").thumbnail("https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400").images(List.of("https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800")).rating(4.8).reviewCount(289).featured(false).active(true).build(),
            Product.builder().name("Coffee Grinder Burr Pro").description("Conical burr grinder with 30 grind settings. Perfect from espresso to French press.").price(new BigDecimal("5500")).discountPrice(null).stock(22).category("Kitchen").brand("BrewMaster").thumbnail("https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400").images(List.of("https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800")).rating(4.9).reviewCount(178).featured(true).active(true).build(),
            Product.builder().name("Leather Bifold Wallet").description("Full-grain leather, RFID blocking, slim 6-card design. Ages beautifully.").price(new BigDecimal("1600")).discountPrice(new BigDecimal("1299")).stock(90).category("Fashion").brand("LuxLeather").thumbnail("https://images.unsplash.com/photo-1627123424574-724758594e93?w=400").images(List.of("https://images.unsplash.com/photo-1627123424574-724758594e93?w=800")).rating(4.5).reviewCount(334).featured(false).active(true).build()
        );
        productRepository.saveAll(products);
        log.info("Seeded {} products", products.size());
    }
}
