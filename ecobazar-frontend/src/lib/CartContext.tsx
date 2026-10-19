import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from './types';
import { authService } from './auth';

interface CartItem extends Product {
  quantityInCart: number;
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  placeOrder: (shippingAddress: string, paymentMethod: string) => Promise<void>;
  placingOrder: boolean;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

const API_BASE = 'http://localhost:8082';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [placingOrder, setPlacingOrder] = useState(false);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantityInCart: item.quantityInCart + quantity } : item
        );
      }
      return [...prev, { ...product, quantityInCart: quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (shippingAddress: string, paymentMethod: string) => {
    const user = authService.getCurrentUser();
    const token = authService.getToken();

    if (!user) {
      throw new Error('You must be logged in to place an order');
    }
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    setPlacingOrder(true);
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          buyerId: Number(user.id),
          shippingAddress,
          paymentMethod,
          items: cart.map(item => ({
            productId: Number(item.id),
            quantity: item.quantityInCart,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to place order');
      }

      clearCart();
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, placeOrder, placingOrder }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};