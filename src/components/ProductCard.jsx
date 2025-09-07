import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingCart } from "lucide-react";
import { CartData } from "@/context/cartContext";
import { UserData } from "@/context/UserContext";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import OfferIcon from "./OfferIcon";

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

  // ✅ Discount calculation
  const getDiscountPercentage = () => {
    if (product.oldPrice && product.price) {
      return Math.round(
        ((product.oldPrice - product.price) / product.oldPrice) * 100
      );
    }
    return null;
  };
  const discount = getDiscountPercentage();

  return (
    <div
    key={product._id}
    className="group bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800 
               rounded-2xl p-3 flex flex-col 
               hover:shadow-xl dark:hover:shadow-2xl
               transition duration-300
               min-h-[300px] sm:min-h-[300px] md:min-h-[300px] lg:w-full"
  >
      {/* ✅ Category Badge */}
      <div className="mb-2">
        {latest === "yes" ? (
          <span className="text-xs text-white font-bold bg-green-600 px-2 py-1 rounded-md">
            {t("new")}
          </span>
        ) : (
          <span className="text-xs text-white font-bold bg-yellow-500 px-2 py-1 rounded-md dark:bg-gray-700">
            {product.category}
          </span>
        )}
      </div>

      {/* ✅ Image + Discount */}
      <div className="w-full flex flex-col">
        <div
          className="w-full flex justify-center items-center h-40 sm:h-48 overflow-hidden rounded-lg cursor-pointer"
          onClick={() => navigate(`/product/${product._id}`)}
        >
          <img
            src={product.images?.[0]?.url || "/placeholder.png"}
            alt={product.title || "Product"}
            className="object-contain max-h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* ✅ Reserve space for badge (even if none) */}
        <div className="w-full flex justify-end mt-2 min-h-[28px] sm:min-h-[32px]">
          {discount > 0 && (
            <Badge
              variant="destructive"
              className="px-3 py-1 text-white text-xs sm:text-sm rounded-full shadow-md flex items-center gap-1"
            >
              <OfferIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              {discount}% OFF
            </Badge>
          )}
        </div>
      </div>

      {/* ✅ Title & Author */}
      <div className="flex-1 mt-3">
        <h4
          onClick={() => navigate(`/product/${product._id}`)}
          className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 
                     hover:underline line-clamp-2"
        >
          {product.title}
        </h4>
        {product.author && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
            By <span className="font-medium">{product.author}</span>
          </p>
        )}
      </div>

      {/* ✅ Price + Cart (sticky bottom row) */}
      <div className="flex mt-3 items-center justify-between">
        {product.oldPrice ? (
         <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center text-sm sm:text-base">
         <span className="text-gray-400 line-through">
           ₹{product.oldPrice}
         </span>
         <span className="text-red-600 font-bold">
           ₹{product.price}
         </span>
       </div>
       
        ) : (
          <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
            ₹{product.price}
          </span>
        )}

        {product.stock > 0 ? (
          <button
            onClick={handleClick}
            className="bg-yellow-400 text-white rounded-full w-9 h-9 sm:w-10 sm:h-10 
                       flex items-center justify-center hover:bg-red-500 transition"
          >
            <ShoppingCart size={18} />
          </button>
        ) : (
          <span className="text-xs font-semibold text-white bg-red-600 px-2 py-1 rounded-md">
            {t("outOfStock")}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
