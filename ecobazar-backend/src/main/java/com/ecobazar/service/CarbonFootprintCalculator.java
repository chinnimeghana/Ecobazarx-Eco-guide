package com.ecobazar.service;

import com.ecobazar.model.Product.Category;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class CarbonFootprintCalculator {

    // Average kg CO2 per unit, by category — a simplified estimate
    private static final Map<Category, Double> BASE_FOOTPRINT = Map.of(
        Category.ELECTRONICS,   8.0,
        Category.CLOTHING,      5.0,
        Category.FOOD,          2.0,
        Category.HOME_GARDEN,   3.5,
        Category.PERSONAL_CARE, 1.5,
        Category.OTHER,         4.0
    );

    private static final double MAX_FOOTPRINT = 10.0;

    public double calculateCarbonFootprint(Category category) {
        return BASE_FOOTPRINT.getOrDefault(category, 4.0);
    }

    public double calculateEcoRating(double carbonFootprint) {
        double rating = 10.0 - (carbonFootprint / MAX_FOOTPRINT) * 10.0;
        return Math.max(1.0, Math.min(10.0, Math.round(rating * 10.0) / 10.0));
    }
}