import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LogIn,
  Menu,
  ShoppingCart,
  User,
  Search,
  Phone,
  Flame,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./mode-toggle";
import { UserData } from "@/context/UserContext";
import { CartData } from "@/context/cartContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AuthLogin from "@/components/AuthLogin";
import { ProductData } from "@/context/productContext";
import axios from "axios";
import { server } from "@/main";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuth, logoutUser, user } = UserData();
  const { totalItem, setTotalItem } = CartData();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { categories, authors } = ProductData();

  const hideNavRoutes = ["/checkout"];
  const shouldHideNav = hideNavRoutes.includes(location.pathname);

  const logouthandler = () => logoutUser(setTotalItem, navigate);
  const handleLanguageChange = (lang) => i18n.changeLanguage(lang);

  // scroll hint logic
  const scrollRef = useRef(null);
  const [showHint, setShowHint] = useState(true);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => setShowHint(el.scrollLeft <= 10);
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Search state
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [openSuggest, setOpenSuggest] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchText.trim().length < 2) {
        setSuggestions([]);
        setOpenSuggest(false);
        return;
      }
      try {
        const { data } = await axios.get(
          `${server}/api/product/autocomplete?q=${searchText}&lang=${i18n.language}`
        );
        setSuggestions(data);
        setOpenSuggest(true);
      } catch (err) {
        console.error(err);
      }
    };
    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchText, i18n.language]);

  const handleSelect = (productId) => {
    setOpenSuggest(false);
    setSearchText("");
    navigate(`/product/${productId}`);
  };

  const [openLogin, setOpenLogin] = useState(false);
  const [step, setStep] = useState("login");

  return (
    <nav className="w-full flex flex-col justify-center items-center relative">
      {/* Top black bar */}
      <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between bg-black text-white px-[5%] lg:px-[2%] py-2 text-sm backdrop-blur">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="text-white hover:text-yellow-600 flex items-center gap-1"
            >
              🌐 {i18n.language === "en" ? "English" : "বাংলা"} ▼
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white text-black">
            <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange("bn")}>
              বাংলা
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Right desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/about" className="hover:text-yellow-600">
            {t("nav.about")}
          </Link>
          <Link to="/contactus" className="hover:text-yellow-600">
            {t("nav.contact")}
          </Link>
          {!isAuth ? (
            <Button
              variant="ghost"
              className="hover:text-yellow-600"
              onClick={() => setOpenLogin(true)}
            >
              <LogIn className="mr-1 h-4 w-4" />
              {t("nav.login")}
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <User />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{t("nav.account")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/orders")}>
                  {t("nav.orders")}
                </DropdownMenuItem>
                {user?.role === "admin" && (
                  <DropdownMenuItem
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    {t("nav.dashboard")}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logouthandler}>
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <ModeToggle />
        </div>

        {/* Mobile hamburger */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden text-white">
              <Menu size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-black text-white p-6">
            <nav className="flex flex-col gap-4">
              <Link to="/about" className="hover:text-yellow-600">
                {t("nav.about")}
              </Link>
              <Link to="/contactus" className="hover:text-yellow-600">
                {t("nav.contact")}
              </Link>
              {!isAuth ? (
                <button
                  onClick={() => setOpenLogin(true)}
                  className="text-left hover:text-yellow-600"
                >
                  {t("nav.login")}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/orders")}
                    className="hover:text-yellow-600"
                  >
                    {t("nav.orders")}
                  </button>
                  {user?.role === "admin" && (
                    <button
                      onClick={() => navigate("/admin/dashboard")}
                      className="hover:text-yellow-600"
                    >
                      {t("nav.dashboard")}
                    </button>
                  )}
                  <button
                    onClick={logouthandler}
                    className="hover:text-yellow-600"
                  >
                    {t("nav.logout")}
                  </button>
                </>
              )}
              <ModeToggle />
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <div className="pt-12"></div>

      {/* Middle Nav */}
      <div className="middle-nav w-full bg-white dark:bg-black shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile */}
          <div className="flex flex-col gap-4 py-4 md:hidden">
            <div className="flex items-center justify-between">
              <Link to="/">
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  Biswa<span className="text-green-600">Bangiya</span><span className="text-yellow-600">Prakashan</span>
                </h2>
              </Link>
              <div className="flex items-center gap-6">
                <Link to="/cart" className="relative">
                  <ShoppingCart className="w-6 h-6 text-gray-600" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItem ?? 0}
                  </span>
                </Link>
                <Phone className="w-6 h-6 text-gray-600" />
              </div>
            </div>

            {/* Search mobile */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={t("search.placeholder")}
                className="pl-10 pr-20 py-2 rounded-lg border w-full"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onBlur={() => setTimeout(() => setOpenSuggest(false), 150)}
              />
              {openSuggest && suggestions.length > 0 && (
                <ul className="absolute bg-white dark:bg-gray-900 border rounded-md mt-1 w-full max-h-48 overflow-y-auto shadow-lg z-50">
                  {suggestions.map((sug) => {
                    const title =
                      i18n.language === "bn" ? sug.title?.bn : sug.title?.en;
                    const author =
                      i18n.language === "bn"
                        ? sug.author?.bn
                        : sug.author?.en;
                    return (
                      <li
                        key={sug._id}
                        onClick={() => handleSelect(sug._id)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        {title}{" "}
                        {author && (
                          <span className="text-sm text-gray-500">— {author}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden md:grid grid-cols-3 gap-2 items-center py-4">
            <Link
              to="/"
              className="text-3xl font-bold text-black dark:text-white"
            >
              Biswa<span className="text-green-500">Bangiya</span><span className="text-yellow-500">Prakashan</span>
            </Link>
            <div className="flex justify-center relative w-full max-w-lg">
              <Search className="absolute left-2 top-2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={t("search.placeholder")}
                className="pl-10 pr-20 py-2 rounded-xl border w-full"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onBlur={() => setTimeout(() => setOpenSuggest(false), 150)}
              />
              {openSuggest && suggestions.length > 0 && (
                <ul className="absolute top-12 left-0 bg-white dark:bg-gray-900 border rounded-md w-full max-h-60 overflow-y-auto shadow-lg z-50">
                  {suggestions.map((sug) => {
                    const title =
                      i18n.language === "bn" ? sug.title?.bn : sug.title?.en;
                    const author =
                      i18n.language === "bn"
                        ? sug.author?.bn
                        : sug.author?.en;
                    return (
                      <li
                        key={sug._id}
                        onClick={() => handleSelect(sug._id)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        {title}{" "}
                        {author && (
                          <span className="text-sm text-gray-500">— {author}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className="flex justify-end items-center gap-4">
              <div className="flex items-center gap-2">
                <Phone className="w-6 h-6 text-gray-500" />
                <div className="text-sm">
                  <span className="text-gray-500">{t("help.text")}</span>
                  <span className="block text-yellow-600 font-bold">
                    +08 9229 8228
                  </span>
                </div>
              </div>
              <Link to="/cart" className="flex items-center gap-2 relative">
                <ShoppingCart className="w-6 h-6 text-gray-500" />
                <span className="text-yellow-600 font-bold">
                  {t("nav.cart")}
                </span>
                <span className="absolute -top-3 right-6 z-10 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItem ?? 0}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

  {/* ================== BOTTOM NAV ================== */}

      {/* Bottom Nav */}
      {!shouldHideNav && (
        <Card className="w-full px-2 lg:px-[12%] py-3 shadow-sm rounded-none">
          <div className="hidden md:flex items-center justify-center gap-6 text-sm font-medium">
            {/* Shop Categories */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex text-left gap-2 font-semibold text-base">
                ☰ {t("nav.categories")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                {categories.map((category, i) => (
                  <DropdownMenuItem key={i} asChild>
                    <Link to={`/products?category=${category}`} className="flex items-center gap-3 px-2 py-1">
                      {category}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Authors */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex text-left gap-2 font-semibold text-base">
                {t("nav.authors")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                {authors.map((author, i) => (
                  <DropdownMenuItem key={i} asChild>
                    <Link to={`/products?author=${author}`} className="flex items-center gap-3 px-2 py-1">
                      {author}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/" className="hover:text-yellow-500">{t("nav.home")}</Link>
            <Link to="/products" className="hover:text-yellow-500">{t("nav.allProducts")}</Link>
            <Link to="/publisher" className="hover:text-yellow-500">{t("nav.publishers")}</Link>
            <Link to="/blog" className="hover:text-yellow-500">{t("nav.blog")}</Link>
            <Link to="/catalogue" className="hover:text-yellow-500">{t("nav.catalogue")}</Link>
            <Link to="/wishlist" className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-600" />
              <span className="font-bold">{t("nav.deal")}</span>
              <span className="bg-red-600 text-white text-xs px-1 py-0.5 rounded-sm uppercase">hot</span>
            </Link>
          </div>

          {/* Mobile Bottom */}
          <div className="relative md:hidden">
            <div
              ref={scrollRef}
              className="flex items-center gap-5 text-sm font-medium overflow-x-auto no-scrollbar py-2 px-1"
            >
              {/* Categories Mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 text-sm px-2">
                  ☰ {t("nav.categories")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  {categories.map((category, i) => (
                    <DropdownMenuItem key={i} asChild>
                      <Link to={`/products?category=${category}`} className="flex items-center gap-3 px-2 py-1">
                        {category}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Authors Mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 text-sm px-2">
                    {t("nav.authors")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  {authors.map((author, i) => (
                    <DropdownMenuItem key={i} asChild>
                      <Link to={`/products?author=${author}`} className="flex items-center gap-3 px-2 py-1">
                        {author}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/" className="hover:text-yellow-500"><Button className="active:bg-gray-700 active:scale-95 transition-all duration-200">{t("nav.home")}</Button></Link>
              <Link to="/products" className="hover:text-yellow-500 text-sm"> <Button  className="active:bg-gray-700 active:scale-95 transition-all duration-200">{t("nav.allProducts")}</Button></Link>
              <Link to="/publisher" className="hover:text-yellow-500"><Button className="active:bg-gray-700 active:scale-95 transition-all duration-200">{t("nav.publishers")}</Button></Link>
              <Link to="/blog" className="hover:text-yellow-500"><Button className="active:bg-gray-700 active:scale-95 transition-all duration-200">{t("nav.blog")}</Button></Link>
              <Link to="/catalogue" className="hover:text-yellow-500"><Button className="active:bg-gray-700 active:scale-95 transition-all duration-200">{t("nav.catalogue")}</Button></Link>
              <Link to="/wishlist" className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-red-600" />
                <span className="font-bold">{t("nav.deal")}</span>
                <span className="bg-red-600 text-white text-[10px] px-1 py-0.5 rounded-sm uppercase">hot</span>
              </Link>
            </div>
            {showHint && (
              <div className="absolute right-0 top-0 -translate-y-1/2 text-gray-400 text-sm animate-pulse pointer-events-none">
                ❯
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Login Dialog */}
      <Dialog
        open={openLogin}
        onOpenChange={(isOpen) => {
          setOpenLogin(isOpen);
          if (!isOpen) setStep("login");
        }}
      >
        <DialogContent key={step} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {step === "login"
                ? t("login.title")
                : t("verify.title")}
            </DialogTitle>
            <DialogDescription>
              {step === "login"
                ? t("login.description")
                : t("verify.subtitle")}
            </DialogDescription>
          </DialogHeader>
          <AuthLogin
            step={step}
            setStep={setStep}
            onSuccess={() => {
              setStep("login");
              setOpenLogin(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;