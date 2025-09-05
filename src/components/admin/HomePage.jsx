import { ProductData } from '@/context/productContext';
import React, { useEffect, useState } from 'react';
import Loading from '../Loading';
import ProductCard from '../ProductCard';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from '../ui/pagination';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Input } from '../ui/input';
import { server } from '@/main';
import axios from 'axios';
import toast from 'react-hot-toast';

const HomePage = () => {
  const { product, page, setPage, fetchProducts, loading, totalPages } = ProductData();

  const nextPage = () => setPage(page + 1);
  const prevPage = () => setPage(page - 1);

  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    title_en: '',
    title_bn: '',
    description_en: '',
    description_bn: '',
    category_en: '',
    category_bn: '',
    author_en: '',
    author_bn: '',
    price: '',
    oldPrice: '',   // ✅ Added old price
    stock: '',
    images: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, images: e.target.files }));
  };
  useEffect(() => {
    fetchProducts();
  }, [page]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.images || formData.images.length === 0) {
      toast.error('Please select images');
      return;
    }

    const form = new FormData();

    // ✅ Append fields in nested format
    form.append("title[en]", formData.title_en);
    form.append("title[bn]", formData.title_bn);
    form.append("description[en]", formData.description_en);
    form.append("description[bn]", formData.description_bn);
    form.append("category[en]", formData.category_en);
    form.append("category[bn]", formData.category_bn);
    form.append("author[en]", formData.author_en);
    form.append("author[bn]", formData.author_bn);
    form.append("price", formData.price);
    form.append("oldPrice", formData.oldPrice);  // ✅ Send old price
    form.append("stock", formData.stock);

    // Append images
    for (let i = 0; i < formData.images.length; i++) {
      form.append("files", formData.images[i]);
    }

    try {
      const { data } = await axios.post(`${server}/api/product/new`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      toast.success(data.message);
      setOpen(false);
      setFormData({
        title_en: '',
        title_bn: '',
        description_en: '',
        description_bn: '',
        category_en: '',
        category_bn: '',
        author_en: '',
        author_bn: '',
        price: '',
        oldPrice: '',
        stock: '',
        images: null
      });
      fetchProducts();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Products</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="mb-4">Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Products</DialogTitle>
            </DialogHeader>
            <form onSubmit={submitHandler} className="space-y-4">
              {/* English Fields */}
              <Input
                name="title_en"
                placeholder="Product Title (English)"
                value={formData.title_en}
                onChange={handleChange}
                required
              />
              <Input
                name="description_en"
                placeholder="Product Description (English)"
                value={formData.description_en}
                onChange={handleChange}
                required
              />
              <Input
                name="category_en"
                placeholder="Category (English)"
                value={formData.category_en}
                onChange={handleChange}
                required
              />
              <Input
                name="author_en"
                placeholder="Author (English)"
                value={formData.author_en}
                onChange={handleChange}
                required
              />

              {/* Bengali Fields */}
              <Input
                name="title_bn"
                placeholder="পণ্যের নাম (Bengali)"
                value={formData.title_bn}
                onChange={handleChange}
                required
              />
              <Input
                name="description_bn"
                placeholder="পণ্যের বিবরণ (Bengali)"
                value={formData.description_bn}
                onChange={handleChange}
                required
              />
              <Input
                name="category_bn"
                placeholder="ক্যাটেগরি (Bengali)"
                value={formData.category_bn}
                onChange={handleChange}
                required
              />
              <Input
                name="author_bn"
                placeholder="লেখক (Bengali)"
                value={formData.author_bn}
                onChange={handleChange}
                required
              />

              {/* Price & Old Price & Stock */}
              <Input
                name="price"
                type="number"
                placeholder="New Price"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <Input
                name="oldPrice"
                type="number"
                placeholder="Old Price (Optional)"
                value={formData.oldPrice}
                onChange={handleChange}
              />
              <Input
                name="stock"
                type="number"
                placeholder="Product Stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />

              {/* Images */}
              <Input
                type="file"
                multiple
                name="images"
                accept="image/*"
                onChange={handleFileChange}
                required
              />

              <Button type="submit" className="w-full">
                Create Product
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {product && product.length > 0 ? (
            product.map((e) => <ProductCard product={e} key={e._id} latest="no" />)
          ) : (
            <p className="col-span-full text-center">No products yet</p>
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
            {page !== totalPages && (
              <PaginationItem className="cursor-pointer" onClick={nextPage}>
                <PaginationNext />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default HomePage;
