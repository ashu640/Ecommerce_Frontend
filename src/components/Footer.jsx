import { Facebook, Instagram, X, Youtube } from "lucide-react";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ProductData } from "@/context/productContext"; // ✅ same as Navbar

const Footer = () => {
  const { t } = useTranslation("footer");
  const { categories } = ProductData(); // ✅ get categories

  return (
    <footer className="bg-[#f8f8f8] dark:bg-gray-800 dark:text-white mt-10 text-[#333]">
      <div className="px-[8%] lg:px-[12%] py-5">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Side */}
          <div className="lg:w-2/3 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand */}
              <div>
                <Link to="/" className="block mb-3">
                  <h2 className="text-3xl font-bold font-bricolage">
                    {t("brand")}{" "}
                    <span className="text-green-700 font-bricolage">
                      {t("brandHighlight")}
                    </span>
                  </h2>
                </Link>
                <p className="text-sm leading-relaxed">{t("tagline")}</p>
              </div>

              {/* Useful Links */}
              <div>
                <h3 className="text-2xl font-semibold mb-3">
                  {t("usefulLinks")}
                </h3>
                <ul>
                  <li className="mb-2">
                    <Link
                      to="/"
                      className="text-[#333] dark:text-white hover:text-[#ff823a] transition-all duration-300 hover:ml-2 block"
                    >
                      {t("home")}
                    </Link>
                    <Link
                      to="/about"
                      className="text-[#333] dark:text-white hover:text-[#ff823a] transition-all duration-300 hover:ml-2 block"
                    >
                      {t("about")}
                    </Link>
                    <Link
                      to="/shop"
                      className="text-[#333] dark:text-white hover:text-[#ff823a] transition-all duration-300 hover:ml-2 block"
                    >
                      {t("shop")}
                    </Link>
                    <Link
                      to="/blog"
                      className="text-[#333] dark:text-white hover:text-[#ff823a] transition-all duration-300 hover:ml-2 block"
                    >
                      {t("blog")}
                    </Link>
                    <Link
                      to="/contact"
                      className="text-[#333] dark:text-white hover:text-[#ff823a] transition-all duration-300 hover:ml-2 block"
                    >
                      {t("contact")}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Categories (dynamic) */}
              <div>
                <h3 className="text-2xl font-semibold mb-3">
                  {t("categories")}
                </h3>
                <ul>
                  {categories?.length > 0 ? (
                    categories.map((cat, i) => (
                      <li key={i} className="mb-2">
                        <Link
                          to={`/products?category=${cat}`}
                          className="text-[#333] dark:text-white hover:text-[#ff823a] transition-all duration-300 hover:ml-2 block"
                        >
                          {cat}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">{t("noCategories")}</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - Newsletter */}
          <div className="lg:w-1/3 w-full">
            <h3 className="text-2xl font-semibold mb-3">{t("newsletter")}</h3>
            <p className="mb-3 text-sm">{t("newsletterText")}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                className="flex-grow px-4 py-3 border border-gray-300 bg-white text-[#333] text-base focus:outline-none rounded-md"
                placeholder={t("newsletterPlaceholder")}
              />
              <button className="px-5 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-all">
                {t("subscribe")}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <p className="text-center lg:text-left text-sm">
              © 2025 | {t("allRights")}{" "}
              <a href="#" className="underline font-bold text-[#ff823a]">
                {t("brand")}
              </a>
            </p>

            {/* Social Links */}
            <div className="flex gap-4 text-xl text-[#333]">
              <a href="#">
                <Instagram className="hover:text-[#ff823a] transition" />
              </a>
              <a href="#">
                <Facebook className="hover:text-[#ff823a] transition" />
              </a>
              <a href="#">
                <X className="hover:text-[#ff823a] transition" />
              </a>
              <a href="#">
                <Youtube className="hover:text-[#ff823a] transition" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
