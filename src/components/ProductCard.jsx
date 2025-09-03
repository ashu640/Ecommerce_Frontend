import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingCart } from 'lucide-react'
import { CartData } from "@/context/cartContext";
import { UserData } from "@/context/UserContext";
import toast from "react-hot-toast";

const ProductCard = ({ product, latest }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("product");
  const { addToCart } = CartData();
  const { isAuth } = UserData();

  const addToCartHandler = () => addToCart(product._id);

  const handleClick = () => {
    if (!isAuth) {
      toast.error("Please Login"); 
      return;
    }

    if (product.stock <= 0) {
      toast.error("Out Of Stock");
      return;
    }

    addToCartHandler();
  };

  // ✅ Calculate discount percentage if oldPrice exists
  const getDiscountPercentage = () => {
    if (product.oldPrice && product.price) {
      return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
    }
    return null;
  };

  const discount = getDiscountPercentage();

  return (
    <>
      {product && (
        <div
          key={product._id}
          className="bg-white dark:bg-gray-900 shadow-md dark:shadow-lg 
                     rounded-2xl p-4 flex flex-col items-start relative
                     w-full min-h-[350px] hover:shadow-2xl 
                     dark:hover:shadow-gray-700 transition duration-300 
                     group cursor-pointer"
        >
          {/* ✅ Offer Tag if discount available */}
          {discount && (
            <div className="absolute top-3 right-3 bg-red-500 dark:bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              {discount}% OFF
            </div>
          )}

          {/* Badge */}
          {latest === "yes" ? (
            <p className="text-xs text-white font-bold mb-1 bg-green-600 px-3 py-1 rounded">
              {t("new")}
            </p>
          ) : (
            <p className="text-xs text-white mt-0 font-bold mb-1 bg-yellow-400 px-3 py-1 rounded-xl dark:bg-gray-700">
              {product.category}
            </p>
          )}

          {/* Image */}
          <div
            className="w-full flex justify-center"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <img
              src={product.images?.[0]?.url || "/placeholder.png"}
              alt={product.title || "Product"}
              className="w-full max-h-40 object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Title */}
          <h4
            onClick={() => navigate(`/product/${product._id}`)}
            className="text-base md:text-lg font-medium mt-3 text-yellow-800 dark:text-yellow-300 hover:underline line-clamp-2"
          >
            {product.title}
          </h4>

          {/* ✅ Author */}
          {product.author && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              By <span className="font-medium">{product.author}</span>
            </p>
          )}

          {/* Price + Cart/Stock */}
          <div className="flex mt-5 flex-row items-center justify-between w-full">
            {product.oldPrice ? (
              <div className="mt-1 text-sm md:text-md flex gap-2 items-center">
                <span className="text-gray-400 dark:text-gray-500 line-through">
                  ₹{product.oldPrice}
                </span>
                <span className="text-red-600 dark:text-red-400 font-bold">
                  ₹{product.price}
                </span>
              </div>
            ) : (
              <div className="text-md md:text-lg font-semibold mt-1 text-gray-900 dark:text-gray-100">
                ₹{product.price}
              </div>
            )}

            {/* Show button based on stock */}
            {product.stock > 0 ? (
              <button
                onClick={handleClick}
                className="bg-yellow-400 text-white rounded-full w-10 h-10 md:w-11 md:h-11
                           hover:bg-red-500 hover:shadow-xl transition flex items-center justify-center"
              >
                <ShoppingCart />
              </button>
            ) : (
              <span className="text-xs font-semibold text-white bg-red-600 px-3 py-1 rounded-full">
                {t("outOfStock")}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
