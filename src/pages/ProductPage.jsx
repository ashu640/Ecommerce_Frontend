import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import toast from "react-hot-toast";
import axios from "axios";
import { server, categories } from "@/main";
import { Edit, Loader, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProductData } from "@/context/productContext";
import { CartData } from "@/context/cartContext";
import { UserData } from "@/context/UserContext";
import { useTranslation } from "react-i18next";

// ✅ Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const ProductPage = () => {
  const { t, i18n } = useTranslation("productpage");  

  const { id } = useParams();
  const { prod, relatedProduct, fetchProduct, loading, fetchProducts } = ProductData();
  const { addToCart } = CartData();
  const { isAuth, user } = UserData();

  const [showZoom, setShowZoom] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showEdit, setShowEdit] = useState(false);
   console.log(prod)
  // ✅ State for both languages
  const [titleEn, setTitleEn] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [categoryEn, setCategoryEn] = useState("");
  const [categoryBn, setCategoryBn] = useState("");
  const [authorEn, setAuthorEn] = useState("");   // ✅ author.en
  const [authorBn, setAuthorBn] = useState("");   // ✅ author.bn
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice,setOldPrice]=useState("");

  const [btnLoading, setBtnLoading] = useState(false);
  const [updatedImages, setUpdatedImages] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchProduct(id, i18n.language);   // ✅ pass language here
  }, [id, i18n.language]);              // ✅ re-run when language changes

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const addToCartHandler = () => addToCart(id);

  const updateHandler = () => {
    setShowEdit(!showEdit);
    if (prod) {
      // ✅ Prefill with both languages if available
      setCategoryEn(prod.category?.en || "");
      setCategoryBn(prod.category?.bn || "");
      setTitleEn(prod.title?.en || "");
      setTitleBn(prod.title?.bn || "");
      setDescriptionEn(prod.description?.en || "");
      setDescriptionBn(prod.description?.bn || "");
      setAuthorEn(prod.author?.en|| ""); // ✅ prefill author.en
      setAuthorBn(prod.author?.bn|| ""); // ✅ prefill author.bn
      setStock(prod.stock || "");
      setPrice(prod.price || "");
      setOldPrice(prod.oldPrice||"");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const { data } = await axios.put(
        `${server}/api/product/${id}`,
        {
          title: { en: titleEn, bn: titleBn },
          description: { en: descriptionEn, bn: descriptionBn },
          category: { en: categoryEn, bn: categoryBn },
          author: { en: authorEn, bn: authorBn },   // ✅ send author
          price,
          stock,
          oldPrice
        },
        { withCredentials: true }
      );
      toast.success(data.message);
      fetchProduct(id, i18n.language);
      fetchProducts();    
      setShowEdit(false);
    } catch (error) {
      toast.error(error.response?.data?.message || t("updateFailed"));
    } finally {
      setBtnLoading(false);
    }
  };

  const handleSubmitImage = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    if (!updatedImages || updatedImages.length === 0) {
      toast.error(t("pleaseSelectImages"));
      setBtnLoading(false);
      return;
    }
    const formData = new FormData();
    for (let i = 0; i < updatedImages.length; i++) {
      formData.append("files", updatedImages[i]);
    }
    try {
      const { data } = await axios.post(`${server}/api/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success(data.message);
      fetchProduct(id, i18n.language);
    } catch (error) {
      toast.error(error.response?.data?.message || t("imageUpdateFailed"));
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : prod ? (
        <>
          {/* Breadcrumb */}
          <div className="w-full bg-yellow-100 py-4 px-[8%] lg:px-[12%]">
            <div className="text-lg text-gray-600 space-x-2">
              <Link to="/" className="hover:underline text-gray-700 font-medium">
                Home
              </Link>
              <span className="text-gray-500">&nbsp;/&nbsp;</span>
              <span className="text-red-900">Product Details</span>
            </div>
          </div>

          {/* Product Section */}
          <div className="flex flex-col md:flex-row items-start px-[8%] lg:px-[12%] py-16 gap-8">
            {/* Image & Zoom */}
            <div className="w-full md:w-1/2 flex gap-6 p-4">
              <div
                className="relative w-[350px] h-[350px] overflow-hidden rounded-xl shadow-md cursor-pointer"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleMouseMove}
              >
                {/* Product Images Slider */}
                <div className="w-full h-90 relative">
                  {prod.images && prod.images.length > 0 ? (
                    <Swiper
                      pagination={{ clickable: true }}
                      modules={[Pagination]}
                      className="h-full"
                      onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                    >
                      {prod.images.map((img, idx) => (
                        <SwiperSlide key={idx}>
                          <img
                            src={img.url}
                            alt={`${prod.title}-${idx}`}
                            className="w-full h-full object-contain"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <img
                      src="/placeholder.jpg"
                      alt="No preview"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>
              {showZoom && prod.images && prod.images.length>0 && (
                <div className="w-[280px] h-[280px] overflow-hidden hidden rounded-xl shadow-md md:block relative">
                  <img
                    src={prod.images[activeIndex].url}
                    alt="zoom"
                    className="absolute w-[500px] h-[500px] object-contain pointer-events-none"
                    style={{
                      left: `-${mousePosition.x * 1.2}px`,
                      top: `-${mousePosition.y * 2.5}px`,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="w-full md:w-1/2">
              <p className="text-sm font-semibold bg-red-500 inline-block px-3 py-1 rounded text-white mb-3">
                {prod.category}
              </p>
              <h1 className="text-3xl font-bold mb-2">{prod.title}</h1>

              {/* ✅ Show Author */}
              {prod.author && (
                <p className="text-md text-gray-700 mb-2">
                  <span className="font-semibold">Author: </span>
                  {prod.author}
                </p>
              )}

            {/* ✅ Price Section with Old Price */}
            <div className="mb-4 flex items-center gap-2">
  {prod.oldPrice && (
    <>
      <span className="text-gray-400 line-through text-lg">
        ₹{prod.oldPrice}
      </span>
      <span className="text-green-600 text-sm font-semibold">
        (
        {Math.round(
          ((prod.oldPrice - prod.price) / prod.oldPrice) * 100
        )}
        % OFF)
      </span>
    </>
  )}
  <span className="text-2xl font-bold text-red-600">
    ₹{prod.price}
  </span>
</div>
              <p className="mb-6">{prod.description}</p>

              {/* Buttons */}
              <div className="flex flex-col gap-4 py-2">
                {isAuth ? (
                  prod.stock <= 0 ? (
                    <p className="text-red-600 text-xl">{t("outOfStock")}</p>
                  ) : (
                    <Button
                      onClick={addToCartHandler}
                      className="bg-red-500 hover:bg-yellow-500 text-white px-6 py-2 rounded"
                    >
                      {t("addToCart")}
                    </Button>
                  )
                ) : (
                  <p className="text-blue-500">{t("pleaseLogin")}</p>
                )}

                <div className="bg-red-100 p-4 rounded">
                  <ul className="text-black font-medium space-y-1">
                    <li>- Estimated delivery time 14-30 days</li>
                    <li>- 18 months warranty at Genuine Warranty Center</li>
                    <li>- Use coupon to get extra discount</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Edit */}
          {user && user.role === "admin" && (
            <div className="px-[8%] lg:px-[12%] mb-8">
              <Button onClick={updateHandler}>
                {showEdit ? <X /> : <Edit />}
              </Button>
              {showEdit && (
                <form onSubmit={submitHandler} className="space-y-4 mt-4">
                  <div>
                    <Label>{t("titleEn")}</Label>
                    <Input
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>{t("titleBn")}</Label>
                    <Input
                      value={titleBn}
                      onChange={(e) => setTitleBn(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>{t("descriptionEn")}</Label>
                    <Input
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>{t("descriptionBn")}</Label>
                    <Input
                      value={descriptionBn}
                      onChange={(e) => setDescriptionBn(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>{t("categoryEn")}</Label>
                    <Input
                      value={categoryEn}
                      onChange={(e) => setCategoryEn(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>{t("categoryBn")}</Label>
                    <Input
                      value={categoryBn}
                      onChange={(e) => setCategoryBn(e.target.value)}
                    />
                  </div>

                  {/* ✅ Author fields */}
                  <div>
                    <Label>{t("authorEn") || "Author (English)"}</Label>
                    <Input
                      value={authorEn}
                      onChange={(e) => setAuthorEn(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>{t("authorBn") || "Author (Bengali)"}</Label>
                    <Input
                      value={authorBn}
                      onChange={(e) => setAuthorBn(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>{t("oldPrice")}</Label>
                    <Input
                      type="number"
                      value={oldPrice}
                      onChange={(e) => setOldPrice(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>{t("price")}</Label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>{t("stock")}</Label>
                    <Input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={btnLoading}>
                    {btnLoading ? <Loader /> : t("updateProduct")}
                  </Button>
                </form>
              )}

              {/* Image Upload */}
              <form
                onSubmit={handleSubmitImage}
                className="flex flex-col gap-4 mt-6"
              >
                <Label>{t("uploadNewImages")}</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setUpdatedImages(e.target.files)}
                />
                <Button type="submit" disabled={btnLoading}>
                  {btnLoading ? t("updating") : t("updateImage")}
                </Button>
              </form>
            </div>
          )}

          {/* Shipping Policy */}
          <div className="px-[8%] lg:px-[12%] mb-10">
            <h2 className="text-2xl font-bold mb-4">Shipping Policy</h2>
            <p className="mb-3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit...
            </p>
            <p className="mb-3">
              Eveniet fugiat non deleniti libero provident hic eos!
            </p>
          </div>

          {/* Review Section */}
          <div className="px-[8%] lg:px-[10%] mb-12">
            <div className="px-[2%] py-[20px] border rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Add a Review
              </h2>
              <form className="space-y-5">
                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Your Name"
                    className="w-full px-4 border rounded-lg focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    Rating
                  </label>
                  <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400">
                    <option disabled>Select rating</option>
                    <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                    <option value="4">⭐⭐⭐⭐ (4)</option>
                    <option value="3">⭐⭐⭐ (3)</option>
                    <option value="2">⭐⭐ (2)</option>
                    <option value="1">⭐ (1)</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    Your Review
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Enter Your Review"
                    className="w-full px-4 border rounded-lg focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-yellow-400 hover:bg-red-500 text-white px-6 py-2 rounded-lg"
                >
                  Submit Review
                </Button>
              </form>
            </div>
          </div>

          {/* Related Products */}
          {relatedProduct?.length > 0 && (
            <div className="px-[8%] lg:px-[12%] mb-12">
              <h2 className="text-xl font-bold mb-4">{t("relatedProducts")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedProduct.map((e) => (
                  <ProductCard key={e._id} product={e} />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-10 text-center text-xl text-red-600">
          Product Not Found
        </div>
      )}
    </>
  );
};

export default ProductPage;
