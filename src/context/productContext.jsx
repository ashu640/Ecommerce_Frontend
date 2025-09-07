import { server } from '@/main';
import axios from 'axios';
import React, { createContext, useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useLocation } from 'react-router-dom';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [product, setProduct] = useState([]);
  const [newProd, setNewProd] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalpages, setTotalpages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [prod, setProd] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);

  // ✅ sync filters with URL
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const search = (searchParams.get("search") || "").trim();
  const category = searchParams.get("category") || "";
  const price = searchParams.get("price") || "";
  const author = (searchParams.get("author") || "").trim(); // ✅ NEW
  const page = parseInt(searchParams.get("page") || "1");

  // ✅ get current language from i18n
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";

  // Fetch products whenever filters or language change
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, author, page, price, lang]); // ✅ added author

  // Fetch all products with filters
  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `${server}/api/product/all?search=${search}&category=${category}&author=${author}&sortByPrice=${price}&page=${page}&lang=${lang}`
      );

      setProduct(data.products);
      setNewProd(data.newProduct);
      setCategories(data.categories);
      setTotalpages(data.totalPages);
      setAuthors(data.authors);

    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }

  // Fetch single product
  async function fetchProduct(id, lang = "en") {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${server}/api/product/${id}?lang=${lang}`);
      setProd(data.product);
      setRelatedProduct(data.relatedProduct);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(err.response?.data?.message || "Failed to fetch product");
    } finally {
      setLoading(false);
    }
  }

  // ✅ helpers to update filters (keeps URL in sync)
  const updateFilter = (key, value) => {
    // if (location.pathname !== "/products") return;
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // ✅ reset page to 1 on filter change
    if (key !== "page") {
      params.set("page", "1");
    }

    setSearchParams(params);
  };

  return (
    <ProductContext.Provider
      value={{
        loading,
        error,
        product,
        newProd,
        categories,
        category,
        search,
        author,       // ✅ expose author
        price,
        page,
        totalpages,
        prod,
        relatedProduct,
        fetchProduct,
        fetchProducts,
        lang,
        authors,

        // expose setters via URL
        setCategory: (val) => updateFilter("category", val),
        setSearch: (val) => updateFilter("search", val),
        setAuthor: (val) => updateFilter("author", val),   // ✅ NEW
        setPrice: (val) => updateFilter("price", val),
        setPage: (val) => updateFilter("page", val),
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const ProductData = () => useContext(ProductContext);
