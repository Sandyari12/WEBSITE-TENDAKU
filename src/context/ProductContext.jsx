import React, { createContext, useContext, useState } from "react";
import { products as initialProducts } from "../data/products";

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);

  // Fungsi untuk mengurangi stok
  const reduceStock = (productId, qty) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: p.stock - qty } : p
      )
    );
  };

  // Fungsi untuk reset stok (opsional, untuk testing/demo)
  const resetStock = () => setProducts(initialProducts);

  return (
    <ProductContext.Provider value={{ products, reduceStock, resetStock }}>
      {children}
    </ProductContext.Provider>
  );
}; 