-- Sample Data for EcoBazar Database
USE ecobazar_db;

-- Sample Users
INSERT INTO users (username, email, password, role, status) VALUES
('john_buyer', 'john@example.com', '$2a$10$hashed_password_here', 'BUYER', 'ACTIVE'),
('sarah_seller', 'sarah@example.com', '$2a$10$hashed_password_here', 'SELLER', 'ACTIVE'),
('mike_seller', 'mike@example.com', '$2a$10$hashed_password_here', 'SELLER', 'ACTIVE'),
('eco_admin', 'admin@ecobazar.com', '$2a$10$hashed_password_here', 'ADMIN', 'ACTIVE'),
('green_buyer', 'green@example.com', '$2a$10$hashed_password_here', 'BUYER', 'ACTIVE');

-- Sample Products
INSERT INTO products (name, description, price, stock, category, eco_rating, carbon_footprint, image_url, status, seller_id) VALUES
('Bamboo Water Bottle', 'Sustainable bamboo water bottle with stainless steel interior. BPA-free and eco-friendly.', 25.99, 50, 'Home & Garden', 'A+', '0.5kg CO₂', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8', 'APPROVED', 2),
('Solar Phone Charger', 'Portable solar-powered charger for all mobile devices. Waterproof and durable design.', 89.99, 20, 'Electronics', 'A', '2.1kg CO₂', 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a', 'APPROVED', 3),
('Organic Cotton T-Shirt', '100% organic cotton t-shirt with eco-friendly dyes. Fair trade certified.', 35.00, 100, 'Fashion', 'A+', '0.8kg CO₂', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 'APPROVED', 2),
('Recycled Laptop Bag', 'Durable laptop bag made from recycled ocean plastic. Water-resistant and stylish.', 45.99, 30, 'Electronics', 'A+', '1.2kg CO₂', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', 'APPROVED', 3),
('Biodegradable Phone Case', 'Compostable phone case made from plant-based materials. Fully biodegradable.', 19.99, 75, 'Electronics', 'A', '0.3kg CO₂', 'https://images.unsplash.com/photo-1601593346740-925612772716', 'PENDING', 2),
('Solar Garden Lights', 'Set of 6 solar-powered LED garden lights. Weather-resistant and energy-efficient.', 32.50, 40, 'Home & Garden', 'A+', '1.5kg CO₂', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64', 'APPROVED', 3);

-- Sample Orders
INSERT INTO orders (buyer_id, total_amount, status, shipping_address, payment_method, carbon_saved) VALUES
(1, 51.98, 'DELIVERED', '123 Green St, Eco City, EC 12345', 'Credit Card', '1.0kg CO₂'),
(5, 89.99, 'SHIPPED', '456 Sustainable Ave, Green Town, GT 67890', 'PayPal', '2.1kg CO₂'),
(1, 35.00, 'PROCESSING', '123 Green St, Eco City, EC 12345', 'Credit Card', '0.8kg CO₂');

-- Sample Order Items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 2, 25.99),
(2, 2, 1, 89.99),
(3, 3, 1, 35.00);

-- Sample Product Reviews
INSERT INTO product_reviews (product_id, buyer_id, rating, review_text, eco_rating) VALUES
(1, 1, 5, 'Amazing quality bamboo bottle! Love the eco-friendly design.', 5),
(2, 5, 4, 'Great solar charger, works well in direct sunlight.', 4),
(3, 1, 5, 'Super comfortable organic cotton shirt. Highly recommended!', 5);

-- Sample Wishlist Items
INSERT INTO wishlist (user_id, product_id) VALUES
(1, 4),
(1, 5),
(5, 1),
(5, 6);

-- Sample Carbon Analytics
INSERT INTO carbon_analytics (user_id, product_id, order_id, carbon_saved, activity_type) VALUES
(1, 1, 1, 1.0, 'PURCHASE'),
(5, 2, 2, 2.1, 'PURCHASE'),
(1, 3, 3, 0.8, 'PURCHASE'),
(2, 1, NULL, 0.5, 'PRODUCT_LISTING'),
(3, 2, NULL, 2.1, 'PRODUCT_LISTING');

-- Sample Seller Analytics
INSERT INTO seller_analytics (seller_id, total_products, total_sales, total_revenue, avg_rating, carbon_score, month_year) VALUES
(2, 3, 3, 86.98, 5.0, 'A+', '2024-01'),
(3, 3, 2, 122.49, 4.5, 'A', '2024-01');

-- Update product stock after orders
UPDATE products SET stock = stock - 2 WHERE id = 1;
UPDATE products SET stock = stock - 1 WHERE id = 2;
UPDATE products SET stock = stock - 1 WHERE id = 3;