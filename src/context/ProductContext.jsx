import React, { createContext, useContext, useState, useEffect } from "react";
import { getProducts } from "../utils/api";

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        // Optional: handle error
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

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
  const resetStock = () => setProducts([]);

  // Fungsi untuk mengedit produk
  const editProduct = (updatedProduct) => {
    setProducts((prev) => prev.map((p) => p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p));
  };

  // Fungsi untuk menghapus produk
  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  return (
    <ProductContext.Provider value={{ products, setProducts, loading, addProduct, editProduct, deleteProduct, reduceStock, resetStock }}>
      {children}
    </ProductContext.Provider>
  );
}; 