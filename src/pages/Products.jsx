import React, { useState, useEffect, useRef } from "react";
import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductData } from "@/context/productContext";
import { Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { server } from "@/main";
import { useSearchParams } from "react-router-dom";

const Products = () => {
  const [show, setShow] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [typing, setTyping] = useState("");
  const [openSuggest, setOpenSuggest] = useState(false);

  const [authorTyping, setAuthorTyping] = useState("");
  const [authorSuggestions, setAuthorSuggestions] = useState([]);
  const [openAuthorSuggest, setOpenAuthorSuggest] = useState(false);

  const { t, i18n } = useTranslation("product");
  const [searchParams, setSearchParams] = useSearchParams();
  const [mounted, setMounted] = useState(false);

  const {
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
    product,
    loading,
    author,
    setAuthor,
  } = ProductData();

  const inputRef = useRef(null);

  // ✅ Initialize filters from URL
  useEffect(() => {
    const urlCategory = searchParams.get("category") || "";
    const urlSearch = searchParams.get("search") || "";
    const urlPrice = searchParams.get("price") || "";
    const urlAuthor = searchParams.get("author") || "";
    const urlPage = parseInt(searchParams.get("page") || "1");

    if (urlCategory !== category) setCategory(urlCategory);
    if (urlSearch !== search) setSearch(urlSearch);
    if (urlPrice !== price) setPrice(urlPrice);
    if (urlAuthor !== author) {
      setAuthor(urlAuthor);
      setAuthorTyping(urlAuthor);
    }
    if (urlPage !== page) setPage(urlPage);

    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Sync filters to URL
  useEffect(() => {
    if (!mounted) return;

    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    if (price) params.price = price;
    if (author) params.author = author;
    if (page !== 1) params.page = page;

    setSearchParams(params);
  }, [category, search, price, author, page, mounted, setSearchParams]);

  // ✅ Autocomplete suggestions (Title)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (typing.trim().length < 2 || typing === search) {
        setSuggestions([]);
        setOpenSuggest(false);
        return;
      }
      try {
        const { data } = await axios.get(
          `${server}/api/product/autocomplete?q=${typing}&lang=${i18n.language}`
        );
        setSuggestions(data);
        setOpenSuggest(true);
      } catch (err) {
        console.error(err);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [typing, i18n.language, search]);

  // ✅ Autocomplete suggestions (Author)
  useEffect(() => {
    const fetchAuthorSuggestions = async () => {
      if (authorTyping.trim().length < 2 || authorTyping === author) {
        setAuthorSuggestions([]);
        setOpenAuthorSuggest(false);
        return;
      }
      try {
        const { data } = await axios.get(
          `${server}/api/product/author/autocomplete?q=${authorTyping}&lang=${i18n.language}`
        );
        setAuthorSuggestions(data);
        setOpenAuthorSuggest(true);
      } catch (err) {
        console.error(err);
      }
    };

    const debounce = setTimeout(fetchAuthorSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [authorTyping, i18n.language, author]);

  // ✅ Handlers
  const handleSelect = (value) => {
    setSearch(value);
    setTyping(value);
    setOpenSuggest(false);
    setSuggestions([]);
  };

  const handleAuthorSelect = (value) => {
    setAuthor(value);
    setAuthorTyping(value);
    setOpenAuthorSuggest(false);
    setAuthorSuggestions([]);
  };

  const clearFilter = () => {
    setPrice("");
    setCategory("");
    setSearch("");
    setAuthor("");
    setTyping("");
    setAuthorTyping("");
    setPage(1);
    setSuggestions([]);
    setAuthorSuggestions([]);
    setOpenSuggest(false);
    setOpenAuthorSuggest(false);

    setSearchParams({});
  };

  const nextPage = () => setPage(page + 1);
  const prevPage = () => setPage(page - 1);

  if (!mounted) {
    return <Loading />;
  }

  // ✅ Safe helper to resolve localized fields
  const resolveLocalizedField = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    if (typeof field === "object") {
      return i18n.language === "bn"
        ? field.bn || field.en || ""
        : field.en || field.bn || "";
    }
    return "";
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 md:z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          show ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 relative">
          <button
            onClick={() => setShow(false)}
            className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full p-2 md:hidden"
          >
            ✕
          </button>
          <h2 className="text-lg font-bold mb-2">{t("filter")}</h2>

          {/* Search */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-2">
              {t("searchTitle")}
            </label>
            <Input
              ref={inputRef}
              type="text"
              placeholder={t("searchTitle")}
              className="w-full p-2 border rounded-full"
              value={typing}
              onChange={(e) => setTyping(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSelect(typing);
                  setOpenSuggest(false);
                }
              }}
              onBlur={() => {
                setTimeout(() => setOpenSuggest(false), 150);
              }}
            />
            {openSuggest && suggestions.length > 0 && (
              <ul className="absolute bg-white dark:bg-gray-900 border rounded-md mt-1 w-full max-h-48 overflow-y-auto shadow-lg z-50">
                {suggestions.map((sug) => {
                  const title = resolveLocalizedField(sug.title);
                  const author = resolveLocalizedField(sug.author);

                  return (
                    <li
                      key={sug._id}
                      onClick={() => handleSelect(title)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      {title}
                      {author && (
                        <span className="text-sm text-gray-500"> — {author}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Author Filter */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-2">
              {t("author")}
            </label>
            <Input
              type="text"
              placeholder={t("author")}
              className="w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white"
              value={authorTyping}
              onChange={(e) => setAuthorTyping(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAuthorSelect(authorTyping);
                  setOpenAuthorSuggest(false);
                }
              }}
              onBlur={() => {
                setTimeout(() => setOpenAuthorSuggest(false), 150);
              }}
            />
            {openAuthorSuggest && authorSuggestions.length > 0 && (
              <ul className="absolute bg-white dark:bg-gray-900 border rounded-md mt-1 w-full max-h-48 overflow-y-auto shadow-lg z-50">
                {authorSuggestions.map((sug, index) => {
                  const name = resolveLocalizedField(sug);
                  return (
                    <li
                      key={index}
                      onClick={() => handleAuthorSelect(name)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      {name}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {t("category")}
            </label>
            <select
              className="w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">{t("all")}</option>
              {categories.map((e) => (
                <option value={e} key={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {t("price")}
            </label>
            <select
              className="w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            >
              <option value="">{t("select")}</option>
              <option value="lowToHigh">{t("lowToHigh")}</option>
              <option value="highToLow">{t("highToLow")}</option>
            </select>
          </div>

          <Button className="mt-2 w-full" onClick={clearFilter}>
            {t("clearFilter")}
          </Button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-4">
        <button
          onClick={() => setShow(true)}
          className="md:hidden bg-blue-500 text-white px-4 py-2 rounded-md mb-4 flex items-center gap-2"
        >
          <Filter size={18} /> {t("filterButton")}
        </button>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {product && product.length > 0 ? (
              product.map((e) => (
                <div key={e._id} className="flex justify-center">
                  <ProductCard product={e} latest="No" />
                </div>
              ))
            ) : (
              <p className="text-center col-span-full">{t("noProductsFound")}</p>
            )}
          </div>
        )}

        <div className="mt-6 mb-3 flex justify-center">
          <Pagination>
            <PaginationContent className="flex gap-2">
              {page !== 1 && (
                <PaginationItem className="cursor-pointer" onClick={prevPage}>
                  <PaginationPrevious />
                </PaginationItem>
              )}
              {page !== totalpages && (
                <PaginationItem className="cursor-pointer" onClick={nextPage}>
                  <PaginationNext />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default Products;
