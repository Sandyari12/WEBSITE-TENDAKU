import React, { createContext, useState, useContext, useEffect } from 'react';
import { useProducts } from './ProductContext';
import { message } from 'antd';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { products } = useProducts();

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, rentalDays: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateRentalDays = (productId, days) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, rentalDays: Math.max(1, days) }
          : item
      )
    );
  };

  const updateQuantity = (productId, quantity) => {
    setCart(prevCart => {
      const productInStock = products.find(p => p.id === productId);
      if (!productInStock) {
        console.warn(`Product with ID ${productId} not found in stock data.`);
        return prevCart;
      }
      const maxQuantity = productInStock.stock;
      const newQuantity = Math.min(Math.max(1, quantity), maxQuantity);

      if (quantity > maxQuantity) {
        message.error(`Stok ${productInStock.name} hanya tersedia ${maxQuantity} unit.`);
      }

      return prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      return total + (item.price * (item.rentalDays || 1) * (item.quantity || 1));
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateRentalDays,
        clearCart,
        getTotalPrice
      }}
    >
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