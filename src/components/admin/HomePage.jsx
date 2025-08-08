import { ProductData } from '@/context/productContext';
import React, { useState } from 'react';
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
import { categories, server } from '@/main';
import axios from 'axios';
import toast from 'react-hot-toast';

const HomePage = () => {
  const { product, page, setPage, fetchProducts, loading, totalPages } = ProductData();

  const nextPage = () => setPage(page + 1);
  const prevPage = () => setPage(page - 1);

  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
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

  const submitHanlder = async (e) => {
    e.preventDefault();

    if (!formData.images || formData.images.length === 0) {
      toast.error('Please select images');
      return;
    }

    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'images') {
        for (let i = 0; i < value.length; i++) {
          form.append('files', value[i]);
        }
      } else {
        form.append(key, value);
      }
    });

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
        title: '',
        description: '',
        category: '',
        price: '',
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
            <form onSubmit={submitHanlder} className="space-y-4">
              <Input
                name="title"
                placeholder="Product Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <Input
                name="description"
                placeholder="Product Description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded px-3 py-2 bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((e) => (
                  <option value={e} key={e}>
                    {e}
                  </option>
                ))}
              </select>
              <Input
                name="price"
                placeholder="Product Price"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <Input
                name="stock"
                placeholder="Product Stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
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
