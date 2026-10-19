package com.ecobazar.controller;

import com.ecobazar.model.Product;
import com.ecobazar.repository.ProductRepository;
import com.ecobazar.service.CarbonFootprintCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CarbonFootprintCalculator carbonFootprintCalculator;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        double footprint = carbonFootprintCalculator.calculateCarbonFootprint(product.getCategory());
        product.setCarbonFootprint(footprint);
        product.setEcoRating(carbonFootprintCalculator.calculateEcoRating(footprint));
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
    Product product = productRepository.findById(id).orElse(null);
    if (product != null) {
        product.setName(productDetails.getName());
        product.setPrice(productDetails.getPrice());
        product.setDescription(productDetails.getDescription());
        product.setQuantity(productDetails.getQuantity());
        product.setImageUrl(productDetails.getImageUrl());
        if (productDetails.getCategory() != null) {
            product.setCategory(productDetails.getCategory());
            double footprint = carbonFootprintCalculator.calculateCarbonFootprint(productDetails.getCategory());
            product.setCarbonFootprint(footprint);
            product.setEcoRating(carbonFootprintCalculator.calculateEcoRating(footprint));
        }
        return productRepository.save(product);
    }
    return null;
}

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
    try {
        productRepository.deleteById(id);
        return ResponseEntity.ok().build();
    } catch (org.springframework.dao.DataIntegrityViolationException e) {
        return ResponseEntity.status(409).body(
            java.util.Map.of("error", "Cannot delete this product because it has existing orders. Consider marking it unavailable instead.")
        );
    }
  }
}