import { server } from '@/main';
import axios from 'axios';
import React, { createContext, useEffect, useState, useContext } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [product, setProduct] = useState([]);
  const [newProd, setNewProd] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState(1);
  const [totalpages, setTotalpages] = useState(1);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [prod, setProd] = useState([]);
  const [relatedProduct, setRelatedProduct] = useState([]);

  // Debounce effect for search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, category, page, price]);

  // ✅ Fixed: Ensure loading ends even after success
  async function fetchProducts() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${server}/api/product/all?search=${debouncedSearch}&category=${category}&sortByPrice=${price}&page=${page}`
      );
      setProduct(data.products);
      setNewProd(data.newProduct);
      setCategories(data.categories);
      setTotalpages(data.totalpages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProduct(id) {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/product/${id}`);
      setProd(data.product);
      setRelatedProduct(data.relatedProduct);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProductContext.Provider
      value={{
        loading,
        product,
        newProd,
        search,
        setSearch,
        categories,
        category,
        setCategory,
        totalpages,
        price,
        setPrice,
        page,
        setPage,
        prod,
        relatedProduct,
        fetchProduct,
        fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const ProductData = () => useContext(ProductContext);
