package com.ecobazar.dto;

import com.ecobazar.model.Order;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class OrderResponseDto {
    private Long id;
    private BigDecimal totalAmount;
    private Order.OrderStatus status;
    private String shippingAddress;
    private String paymentMethod;
    private String carbonSaved;
    private LocalDateTime createdAt;
    private List<OrderItemResponseDto> orderItems;

    public OrderResponseDto(Order order) {
        this.id = order.getId();
        this.totalAmount = order.getTotalAmount();
        this.status = order.getStatus();
        this.shippingAddress = order.getShippingAddress();
        this.paymentMethod = order.getPaymentMethod();
        this.carbonSaved = order.getCarbonSaved();
        this.createdAt = order.getCreatedAt();
        if (order.getOrderItems() != null) {
            this.orderItems = order.getOrderItems().stream()
                    .map(OrderItemResponseDto::new)
                    .collect(Collectors.toList());
        }
    }

    // Getters
    public Long getId() { return id; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public Order.OrderStatus getStatus() { return status; }
    public String getShippingAddress() { return shippingAddress; }
    public String getPaymentMethod() { return paymentMethod; }
    public String getCarbonSaved() { return carbonSaved; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<OrderItemResponseDto> getOrderItems() { return orderItems; }

    public static class OrderItemResponseDto {
        private Long id;
        private Long productId;
        private String productName;
        private String productImageUrl;
        private Integer quantity;
        private BigDecimal price;

        public OrderItemResponseDto(com.ecobazar.model.OrderItem item) {
            this.id = item.getId();
            if (item.getProduct() != null) {
                this.productId = item.getProduct().getId();
                this.productName = item.getProduct().getName();
                this.productImageUrl = item.getProduct().getImageUrl();
            }
            this.quantity = item.getQuantity();
            this.price = item.getPrice();
        }

        public Long getId() { return id; }
        public Long getProductId() { return productId; }
        public String getProductName() { return productName; }
        public String getProductImageUrl() { return productImageUrl; }
        public Integer getQuantity() { return quantity; }
        public BigDecimal price() { return price; }
        public BigDecimal getPrice() { return price; }
    }
}