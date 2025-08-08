import { ProductData } from '@/context/productContext';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '@/components/Loading';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { UserData } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { CartData } from '@/context/cartContext';
import axios from 'axios';
import { categories, server } from '@/main';
import Cookies from 'js-cookie';
import { Edit, Loader, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

const ProductPage = () => {
  const { t } = useTranslation('productpage'); // Load product.json
  const {
    prod,
    relatedProduct,
    fetchProduct,
    loading
  } = ProductData();

  const { addToCart } = CartData();
  const { id } = useParams();
  const { isAuth, user } = UserData();

  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);
  const [updatedImages, setUpdatedImages] = useState(null);

  useEffect(() => {
    fetchProduct(id);
  }, [id]);

  const addToCartHandler = () => {
    addToCart(id);
  };

  const updateHandler = () => {
    setShow(!show);
    if (prod) {
      setCategory(prod.category);
      setTitle(prod.title);
      setDescription(prod.description);
      setStock(prod.stock);
      setPrice(prod.price);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const { data } = await axios.put(`${server}/api/product/${id}`, {
        title,
        description,
        price,
        stock,
        category,
      }, {
        withCredentials: true,
      });
      toast.success(data.message);
      fetchProduct(id);
      setShow(false);
    } catch (error) {
      toast.error(error.response?.data?.message || t('updateFailed'));
    } finally {
      setBtnLoading(false);
    }
  };

  const handleSubmitImage = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    if (!updatedImages || updatedImages.length === 0) {
      toast.error(t('pleaseSelectImages'));
      setBtnLoading(false);
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < updatedImages.length; i++) {
      formData.append('files', updatedImages[i]);
    }

    try {
      const { data } = await axios.post(`${server}/api/product/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      toast.success(data.message);
      fetchProduct(id);
    } catch (error) {
      toast.error(error.response?.data?.message || t('imageUpdateFailed'));
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="container mx-auto px-4 py-8">
          {user && user.role === 'admin' && (
            <div className="w-[300px] md:w-[450px] m-auto mb-5">
              <Button onClick={updateHandler}>
                {show ? <X /> : <Edit />}
              </Button>

              {show && (
                <form onSubmit={submitHandler} className="space-y-4 mt-4">
                  <div>
                    <Label>{t('title')}</Label>
                    <Input
                      placeholder={t('productTitle')}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>{t('description')}</Label>
                    <Input
                      placeholder={t('description')}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>{t('category')}</Label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white"
                      required
                    >
                      {categories.map((cat) => (
                        <option value={cat} key={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>{t('price')}</Label>
                    <Input
                      type="number"
                      placeholder={t('productPrice')}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>{t('stock')}</Label>
                    <Input
                      type="number"
                      placeholder={t('productStock')}
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={btnLoading}>
                    {btnLoading ? <Loader /> : t('updateProduct')}
                  </Button>
                </form>
              )}
            </div>
          )}

          {prod && (
            <div className="flex flex-col lg:flex-row items-start gap-14">
              <div className="w-[290px] md:w-[500px]">
                <Carousel>
                  <CarouselContent>
                    {prod.images &&
                      prod.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <img
                            src={image.url}
                            alt="image"
                            className="w-full rounded-md"
                          />
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>

                {user && user.role === 'admin' && (
                  <form onSubmit={handleSubmitImage} className="flex flex-col gap-4 mt-4">
                    <div>
                      <Label>{t('uploadNewImages')}</Label>
                      <Input
                        type="file"
                        name="files"
                        multiple
                        accept="image/*"
                        onChange={(e) => setUpdatedImages(e.target.files)}
                      />
                    </div>
                    <Button type="submit" disabled={btnLoading}>
                      {btnLoading ? t('updating') : t('updateImage')}
                    </Button>
                  </form>
                )}
              </div>

              <div className="w-full lg:w-1/2 space-y-4">
                <h1 className="text-2xl font-bold">{prod.title}</h1>
                <p className="text-lg">{prod.description}</p>
                <p className="text-xl font-semibold">₹{prod.price}</p>
                {isAuth ? (
                  prod.stock <= 0 ? (
                    <p className="text-red-600 text-2xl">{t('outOfStock')}</p>
                  ) : (
                    <Button onClick={addToCartHandler}>{t('addToCart')}</Button>
                  )
                ) : (
                  <p className="text-blue-500">{t('pleaseLogin')}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {relatedProduct?.length > 0 && !loading && (
        <div className="mt-12">
          <h2 className="text-xl font-bold">{t('relatedProducts')}</h2>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {relatedProduct.map((e) => (
              <ProductCard key={e._id} product={e} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
