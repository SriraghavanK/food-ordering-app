import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = async (item) => {
    try {
      await axios.post('http://localhost:5000/api/cart', { ...item, quantity: 1 });
      setCartItems(prev => [...prev, item]);
    } catch (err) {
      console.error('Failed to add item to cart:', err);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    try {
      await axios.put(`/api/cart/${id}`, { quantity: newQuantity });
      setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    } catch (err) {
      console.error('Failed to update item quantity:', err);
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`/api/cart/${id}`);
      setCartItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
