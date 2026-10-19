package com.ecobazar.controller;

import com.ecobazar.dto.OrderResponseDto;
import com.ecobazar.model.Order;
import com.ecobazar.model.OrderItem;
import com.ecobazar.model.Product;
import com.ecobazar.model.User;
import com.ecobazar.repository.OrderRepository;
import com.ecobazar.repository.ProductRepository;
import com.ecobazar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/api/orders", "/api/seller/orders"})
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // Place a new order
    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody PlaceOrderRequest request) {
        User buyer = userRepository.findById(request.getBuyerId())
                .orElse(null);
        if (buyer == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Buyer not found"));
        }

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElse(null);
            if (product == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Product not found: " + itemReq.getProductId()));
            }

            BigDecimal itemPrice = product.getPrice();
            BigDecimal lineTotal = itemPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalAmount = totalAmount.add(lineTotal);

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setPrice(itemPrice);
            orderItems.add(orderItem);
        }

        Order order = new Order(buyer, totalAmount, request.getShippingAddress(), request.getPaymentMethod());
        order.setOrderItems(orderItems);
        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    // Get all orders for a specific buyer (Returning raw Order entities so product details serialize properly)
    @GetMapping("/buyer/{buyerId}")
    public List<Order> getOrdersByBuyer(@PathVariable Long buyerId) {
        return orderRepository.findByBuyerId(buyerId);
    }

    // Get a single order by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(order);
    }

    // Get all orders (admin/seller use)
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Update order status (Accept / Reject)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Order not found"));
        }
        
        try {
            Order.OrderStatus parsedStatus = Order.OrderStatus.valueOf(status.toUpperCase());
            order.setStatus(parsedStatus);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status value: " + status));
        }

        Order updatedOrder = orderRepository.save(order);
        return ResponseEntity.ok(updatedOrder);
    }

    // --- Request DTOs ---
    public static class PlaceOrderRequest {
        private Long buyerId;
        private String shippingAddress;
        private String paymentMethod;
        private List<OrderItemRequest> items;

        public Long getBuyerId() { return buyerId; }
        public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

        public String getShippingAddress() { return shippingAddress; }
        public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

        public List<OrderItemRequest> getItems() { return items; }
        public void setItems(List<OrderItemRequest> items) { this.items = items; }
    }

    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}