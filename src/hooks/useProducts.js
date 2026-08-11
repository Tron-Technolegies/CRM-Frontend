import { useCallback, useEffect, useState } from "react";
import {
  getProducts,
  getProduct,
  createProduct as createProductApi,
  updateProduct as updateProductApi,
  deleteProduct as deleteProductApi,
} from "../api/products";

// Manages the product list (fetch/add/update/delete) plus an on-demand
// single-product fetch for the Add/Edit page and the View modal.
export default function useProducts({ autoFetch = true } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (err) {
      console.error("FETCH PRODUCTS ERROR:", err);
      setError("Could not load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) fetchProducts();
  }, [autoFetch, fetchProducts]);

  const fetchProductById = useCallback(async (id) => {
    return getProduct(id);
  }, []);

  const createProduct = useCallback(
    async (payload) => {
      await createProductApi(payload);
      await fetchProducts();
    },
    [fetchProducts]
  );

  const editProduct = useCallback(
    async (id, payload) => {
      await updateProductApi(id, payload);
      await fetchProducts();
    },
    [fetchProducts]
  );

  const removeProduct = useCallback(async (id) => {
    await deleteProductApi(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    createProduct,
    editProduct,
    removeProduct,
  };
}