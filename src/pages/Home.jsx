import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { useEffect } from 'react';

import { Autoplay, EffectFade } from "swiper/modules";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { ProductData } from "@/context/productContext";

// Images
import bookImg1 from "../assets/heroImg (2).png";
import bookImg2 from "../assets/heroImg (1).png";
import banner from "../assets/banner.png";

const Home = () => {
  const navigate = useNavigate();
  const { loading, product, newProd,setSearch, setCategory, setPrice, setPage } = ProductData();
  const { t } = useTranslation("home"); // 👈 using namespace "home"
  useEffect(() => {
    // Reset search & filters whenever Home loads
    setSearch("");
    setCategory("");
    setPrice("");
    setPage(1);
  }, []);

  return (
    <>
      {/* Background blur effects */}
      <div className="relative before:content-[''] before:fixed before:top-5 before:left-0 before:w-[500px] before:h-[200px] before:bg-yellow-400 dark:before:bg-indigo-700 before:blur-[250px] before:-z-10 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-[500px] after:h-[200px] after:bg-yellow-400 dark:after:bg-indigo-700 after:blur-[250px] after:-z-10" />

      {/* Hero Section */}
      <header className="w-full relative">
        <Swiper
          slidesPerView={1}
          loop
          modules={[Autoplay, EffectFade]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1500}
          className="w-full h-[85vh] md:h-[90vh]"
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <div className="hero-bg relative w-full h-full flex flex-col md:flex-row items-center justify-center text-center md:text-left">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-white dark:from-yellow-900/40 dark:to-gray-900" />

              <div className="hero-content relative z-10 flex flex-col items-center md:items-start w-full md:w-1/2 px-[6%] lg:px-[12%]">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
                  {t("discover")}{" "}
                  <span className="text-primary hero-span">{t("newReads")}</span>
                </h1>
                <h5 className="mt-2 text-lg sm:text-xl text-muted-foreground">
                  {t("exclusiveCollection")}
                </h5>
                <div className="mt-6">
                 <Link to='/products'> <Button size="lg" className="rounded-2xl px-8">
                    {t("shopNow")}
                  </Button>
                  </Link>
                </div>
              </div>

              <div className="hero-image relative z-10 w-full md:w-1/2 flex justify-center mt-6 md:mt-0">
                <img
                  src={bookImg1}
                  alt="Bestseller Book"
                  className="h-[250px] sm:h-[300px] md:h-[420px] object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <div className="hero-bg relative w-full h-full flex flex-col md:flex-row items-center justify-center text-center md:text-left">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-white dark:from-indigo-900/40 dark:to-gray-900" />

              <div className="hero-content relative z-10 flex flex-col items-center md:items-start w-full md:w-1/2 px-[6%] lg:px-[12%]">
                <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
                  {t("journey")} <br /> {t("through")}{" "}
                  <span className="text-primary hero-span">{t("stories")}</span>
                </h1>
                <h5 className="mt-2 text-lg sm:text-xl text-muted-foreground">
                  {t("curatedBooks")}
                </h5>
                <div className="mt-6">
                  <Button size="lg" className="rounded-2xl px-8">
                    {t("browseCollection")}
                  </Button>
                </div>
              </div>

              <div className="hero-image relative z-10 w-full md:w-1/2 flex justify-center mt-6 md:mt-0">
                <img
                  src={bookImg2}
                  alt="Featured Book"
                  className="h-[250px] sm:h-[300px] md:h-[420px] object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </header>

      {/* Featured Collection Section */}
      <section className="w-full py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              {t("featuredCollection")}
            </h2>
            <button
              onClick={() => navigate("/products")}
              className="text-yellow-600 hover:text-red-600 font-semibold transition"
            >
              {t("seeAll")} →
            </button>
          </div>

          <Swiper
            slidesPerView={2}
            spaceBetween={15}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 25 },
              1024: { slidesPerView: 4, spaceBetween: 30 },
            }}
            className="product-slider py-2"
          >
            {product.slice(0, 8).map((prod) => (
              <SwiperSlide key={prod._id}>
                <ProductCard product={prod} latest={prod.latest} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Promo Banner Section */}
      <section className="px-[8%] lg:px-[12%] py-5 w-full">
        <div
          className="banner-1 flex flex-col justify-center items-center sm:justify-end sm:items-start bg-cover bg-center rounded-xl p-2 md:p-8 h-[200px] sm:h-[300px] md:h-[400px] text-white shadow-lg w-full"
          style={{ backgroundImage: `url(${banner})` }}
        >
          <button
            onClick={() => navigate("/products")}
            className="lg:ml-5 mt-30 w-fit bg-red-600 hover:bg-red-700 transition text-white font-semibold px-2 py-2 sm:px-5 sm:py-3 md:px-4 md:py-2 rounded-lg shadow-lg text-xs sm:text-sm md:text-base"
          >
            {t("shopNow")} →
          </button>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="w-full py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              {t("newArrivals")}
            </h2>
            <button
              onClick={() => navigate("/products?filter=new")}
              className="text-yellow-600 hover:text-red-600 font-semibold transition"
            >
              {t("seeAll")} →
            </button>
          </div>

          <Swiper
            slidesPerView={1}
            spaceBetween={15}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 25 },
              1024: { slidesPerView: 4, spaceBetween: 30 },
            }}
            className="product-slider"
          >
            {newProd.slice(0, 8).map((prods) => (
              <SwiperSlide key={prods._id}>
                <ProductCard product={prods} latest={"yes"} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default Home;
