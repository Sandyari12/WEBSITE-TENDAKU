import React, { createContext, useContext, useState } from "react";
import { products as initialProducts } from "../data/products";

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);

  // Fungsi untuk menambah produk baru
  const addProduct = (product) => {
    setProducts((prev) => [...prev, product]);
  };

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

  // Fungsi untuk mengedit produk
  const editProduct = (updatedProduct) => {
    setProducts((prev) => prev.map((p) => p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p));
  };

  // Fungsi untuk menghapus produk
  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, editProduct, deleteProduct, reduceStock, resetStock }}>
      {children}
    </ProductContext.Provider>
  );
}; 