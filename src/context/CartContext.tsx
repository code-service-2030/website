"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ServiceItem } from "@/data/translations";

export interface CartItem {
  service: ServiceItem;
  quantity: number;
  notes: string;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (service: ServiceItem) => void;
  removeFromCart: (serviceId: string) => void;
  updateItemNotes: (serviceId: string, notes: string) => void;
  updateItemQuantity: (serviceId: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart on mount
  useEffect(() => {
    const saved = localStorage.getItem("code_services_cart");
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load cart from localStorage:", e);
      }
    }
  }, []);

  // Save cart on changes
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("code_services_cart", JSON.stringify(items));
  };

  const addToCart = (service: ServiceItem) => {
    const existingIdx = cartItems.findIndex((item) => item.service.id === service.id);
    if (existingIdx > -1) {
      // Increment quantity if already exists
      const updated = [...cartItems];
      updated[existingIdx].quantity += 1;
      saveCart(updated);
    } else {
      // Add new item
      const updated = [...cartItems, { service, quantity: 1, notes: "" }];
      saveCart(updated);
    }
    setIsCartOpen(true); // Open the drawer when item is added
  };

  const removeFromCart = (serviceId: string) => {
    const updated = cartItems.filter((item) => item.service.id !== serviceId);
    saveCart(updated);
  };

  const updateItemNotes = (serviceId: string, notes: string) => {
    const updated = cartItems.map((item) => {
      if (item.service.id === serviceId) {
        return { ...item, notes };
      }
      return item;
    });
    saveCart(updated);
  };

  const updateItemQuantity = (serviceId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(serviceId);
      return;
    }
    const updated = cartItems.map((item) => {
      if (item.service.id === serviceId) {
        return { ...item, quantity: qty };
      }
      return item;
    });
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateItemNotes,
        updateItemQuantity,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
