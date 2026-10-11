import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Add item to cart
  const addToCart = (item, restaurant) => {
    // If adding from a different restaurant, reset cart or switch
    if (selectedRestaurant && selectedRestaurant.id !== restaurant.id) {
      if (!window.confirm(`Your cart contains items from ${selectedRestaurant.name}. Discard old items and add from ${restaurant.name}?`)) {
        return;
      }
      setCartItems([{ ...item, quantity: 1 }]);
      setSelectedRestaurant(restaurant);
      setAppliedCoupon(null);
      setDiscountAmount(0);
      return;
    }

    setSelectedRestaurant(restaurant);

    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === item.id);
      if (existing) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  // Remove / decrement item
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === itemId);
      if (!existing) return prevItems;
      if (existing.quantity === 1) {
        const updated = prevItems.filter((i) => i.id !== itemId);
        if (updated.length === 0) {
          setSelectedRestaurant(null);
          setAppliedCoupon(null);
          setDiscountAmount(0);
        }
        return updated;
      }
      return prevItems.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedRestaurant(null);
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const applyCoupon = (coupon, discount) => {
    setAppliedCoupon(coupon);
    setDiscountAmount(discount);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  // Computations
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const itemTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxesAndFee = itemTotal > 0 ? Math.round(itemTotal * 0.05 + 35) : 0;
  const grandTotal = Math.max(0, itemTotal + taxesAndFee - discountAmount);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        selectedRestaurant,
        appliedCoupon,
        discountAmount,
        totalItemCount,
        itemTotal,
        taxesAndFee,
        grandTotal,
        addToCart,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
