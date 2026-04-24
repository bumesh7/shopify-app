package com.shopapp.controller;

import com.shopapp.model.Address;
import com.shopapp.model.User;
import com.shopapp.repository.AddressRepository;
import com.shopapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<List<Address>> getAddresses() {
        return ResponseEntity.ok(addressRepository.findByUserId(currentUser().getId()));
    }

    @PostMapping
    public ResponseEntity<Address> addAddress(@RequestBody Address address) {
        address.setUser(currentUser());
        if (address.getIsDefault()) {
            addressRepository.findByUserIdAndIsDefaultTrue(currentUser().getId())
                    .ifPresent(a -> { a.setIsDefault(false); addressRepository.save(a); });
        }
        return ResponseEntity.ok(addressRepository.save(address));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(@PathVariable Long id, @RequestBody Address updated) {
        Address address = addressRepository.findById(id).orElseThrow();
        address.setLabel(updated.getLabel()); address.setFullName(updated.getFullName());
        address.setPhone(updated.getPhone()); address.setStreet(updated.getStreet());
        address.setCity(updated.getCity()); address.setState(updated.getState());
        address.setPostalCode(updated.getPostalCode()); address.setCountry(updated.getCountry());
        address.setIsDefault(updated.getIsDefault());
        return ResponseEntity.ok(addressRepository.save(address));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
