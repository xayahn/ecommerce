/**
 * useProducts.js
 * Fetches and filters products from the backend.
 * Handles pagination, search, collection filter, and sort.
 */

import { useState, useEffect, useCallback } from "react";
import { productService } from "../services/productService";

const useProducts = (initialParams = {}) => {
  const [products,   setProducts  ] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading,  setIsLoading ] = useState(true);
  const [error,      setError     ] = useState(null);

  const [params, setParams] = useState({
    page:       1,
    limit:      12,
    collection: undefined,
    search:     undefined,
    sortBy:     "createdAt",
    ...initialParams,
  });

  const fetchProducts = useCallback(async (overrides = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const mergedParams = { ...params, ...overrides };
      const result = await productService.getProducts(mergedParams);
      setProducts(result.products);
      setPagination({
        page:       result.page,
        limit:      result.limit,
        total:      result.total,
        totalPages: result.totalPages,
      });
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParams = useCallback((newParams) => {
    setParams((prev) => ({ ...prev, ...newParams, page: newParams.page ?? 1 }));
  }, []);

  const goToPage = useCallback((page) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const setSearch = useCallback((search) => {
    setParams((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const setCollection = useCallback((collection) => {
    setParams((prev) => ({ ...prev, collection, page: 1 }));
  }, []);

  const setSortBy = useCallback((sortBy) => {
    setParams((prev) => ({ ...prev, sortBy, page: 1 }));
  }, []);

  return {
    products,
    pagination,
    isLoading,
    error,
    params,
    updateParams,
    goToPage,
    setSearch,
    setCollection,
    setSortBy,
    refetch: fetchProducts,
  };
};

export default useProducts;