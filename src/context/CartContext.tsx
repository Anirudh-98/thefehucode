"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Cart, CartItem, Product, ProductVariant } from "../types/shopify";

interface CartContextType {
  cart: Cart;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const emptyCart: Cart = {
  id: "mock_cart",
  lines: [],
  subtotalAmount: { amount: "0", currencyCode: "INR" },
  totalAmount: { amount: "0", currencyCode: "INR" },
  totalQuantity: 0,
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("fehucode_cart");
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        if (parsed && Array.isArray(parsed.lines)) {
          // Filter out any invalid/corrupted cart lines on startup
          parsed.lines = parsed.lines.filter(
            (line: any) => line && line.product && line.selectedVariant
          );
        }
        setCart(parsed);
      }
    } catch (e) {
      console.error("Failed to load cart from local storage", e);
    }
    setIsInitialized(true);
  }, []);

  // Save cart to local storage and recalculate totals
  useEffect(() => {
    if (!isInitialized) return;

    const totalQuantity = cart.lines.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.lines.reduce((sum, item) => {
      const price = parseFloat(item.selectedVariant.price);
      return sum + price * item.quantity;
    }, 0);

    const updatedCart = {
      ...cart,
      totalQuantity,
      subtotalAmount: { amount: subtotal.toString(), currencyCode: "INR" },
      totalAmount: { amount: subtotal.toString(), currencyCode: "INR" },
    };

    // Only update state if it actually changed to prevent infinite loops
    if (
      JSON.stringify(updatedCart.lines) !== JSON.stringify(cart.lines) ||
      updatedCart.totalQuantity !== cart.totalQuantity ||
      updatedCart.totalAmount.amount !== cart.totalAmount.amount
    ) {
      setCart(updatedCart);
    }

    try {
      localStorage.setItem("fehucode_cart", JSON.stringify(updatedCart));
    } catch (e) {
      console.error("Failed to save cart to local storage", e);
    }
  }, [cart.lines, isInitialized]);

  const addToCart = (product: Product, variant: ProductVariant, quantity = 1) => {
    if (!product || !variant) {
      console.warn("addToCart called with invalid arguments:", { product, variant });
      return;
    }
    setCart((prevCart) => {
      const lineId = `${product.id}-${variant.id}`;
      const existingLineIndex = prevCart.lines.findIndex((line) => line.id === lineId);
      let updatedLines = [...prevCart.lines];

      if (existingLineIndex > -1) {
        const existingLine = updatedLines[existingLineIndex];
        updatedLines[existingLineIndex] = {
          ...existingLine,
          quantity: existingLine.quantity + quantity,
        };
      } else {
        updatedLines.push({
          id: lineId,
          product,
          selectedVariant: variant,
          quantity,
        });
      }

      return {
        ...prevCart,
        lines: updatedLines,
      };
    });
    setIsCartOpen(true); // Open drawer on addition
  };

  const removeFromCart = (lineId: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      lines: prevCart.lines.filter((line) => line.id !== lineId),
    }));
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(lineId);
      return;
    }
    setCart((prevCart) => ({
      ...prevCart,
      lines: prevCart.lines.map((line) =>
        line.id === lineId ? { ...line, quantity } : line
      ),
    }));
  };

  const clearCart = () => {
    setCart(emptyCart);
    try {
      localStorage.removeItem("fehucode_cart");
    } catch (e) {
      console.error("Failed to remove cart item from local storage", e);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
