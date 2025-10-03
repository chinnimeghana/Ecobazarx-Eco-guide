-- EcoBazar Database Schema
-- MySQL Database Setup

-- Create database
CREATE DATABASE IF NOT EXISTS ecobazar_db;
USE ecobazar_db;

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'SELLER', 'BUYER') NOT NULL,
    status ENUM('ACTIVE', 'PENDING', 'BLOCKED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
);

-- Products table
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    eco_rating VARCHAR(10),
    carbon_footprint VARCHAR(50),
    image_url VARCHAR(500),
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    seller_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_seller (seller_id),
    INDEX idx_eco_rating (eco_rating)
);

-- Orders table
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    buyer_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    shipping_address TEXT,
    payment_method VARCHAR(50),
    carbon_saved VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_buyer (buyer_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Order Items table
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
);

-- Categories table (for better organization)
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    eco_requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Carbon Analytics table
CREATE TABLE carbon_analytics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    product_id BIGINT,
    order_id BIGINT,
    carbon_saved DECIMAL(8,2),
    activity_type ENUM('PURCHASE', 'PRODUCT_LISTING', 'MONTHLY_SUMMARY'),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_recorded_at (recorded_at)
);

-- Seller Analytics table
CREATE TABLE seller_analytics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    seller_id BIGINT NOT NULL,
    total_products INT DEFAULT 0,
    total_sales INT DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    avg_rating DECIMAL(3,2) DEFAULT 0,
    carbon_score VARCHAR(10),
    month_year VARCHAR(7), -- Format: YYYY-MM
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_seller_month (seller_id, month_year),
    INDEX idx_seller (seller_id),
    INDEX idx_month_year (month_year)
);

-- Product Reviews table
CREATE TABLE product_reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    buyer_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    eco_rating INT CHECK (eco_rating >= 1 AND eco_rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_buyer (product_id, buyer_id),
    INDEX idx_product (product_id),
    INDEX idx_buyer (buyer_id),
    INDEX idx_rating (rating)
);

-- Wishlist table
CREATE TABLE wishlist (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id),
    INDEX idx_user (user_id),
    INDEX idx_product (product_id)
);

-- Insert default categories
INSERT INTO categories (name, description, eco_requirements) VALUES
('Electronics', 'Eco-friendly electronic devices and accessories', 'Energy efficient, recyclable materials, minimal packaging'),
('Fashion', 'Sustainable clothing and accessories', 'Organic materials, fair trade, minimal water usage'),
('Home & Garden', 'Sustainable home and garden products', 'Renewable materials, biodegradable, energy efficient'),
('Food & Beverages', 'Organic and sustainable food products', 'Organic certification, minimal packaging, local sourcing'),
('Beauty & Personal Care', 'Natural and eco-friendly beauty products', 'Natural ingredients, cruelty-free, recyclable packaging'),
('Sports & Outdoors', 'Sustainable sports and outdoor equipment', 'Recycled materials, durable design, minimal environmental impact');

-- Insert sample admin user (password should be hashed in real application)
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@ecobazar.com', '$2a$10$example_hashed_password', 'ADMIN');

-- Create indexes for better performance
CREATE INDEX idx_products_name_category ON products(name, category);
CREATE INDEX idx_orders_buyer_status ON orders(buyer_id, status);
CREATE INDEX idx_carbon_analytics_date ON carbon_analytics(recorded_at);