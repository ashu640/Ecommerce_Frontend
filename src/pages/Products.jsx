import React, { useState } from 'react';
import Loading from '@/components/Loading';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ProductData } from '@/context/productContext';
import { Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Products = () => {
  const [show, setShow] = useState(false);
  const { t } = useTranslation('product');

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
  } = ProductData();

  const clearFilter = () => {
    setPrice('');
    setCategory('');
    setSearch('');
    setPage(1);
  };

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    setPage(page - 1);
  };

  return (
    <div className='flex flex-col md:flex-row h-full'>
      {/* Sidebar Filters */}
      <div
        className={`fixed inset-y-0 left-0 z-50 md:z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          show ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='p-4 relative'>
          <button
            onClick={() => setShow(false)}
            className='absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full p-2 md:hidden'
          >
            ✕
          </button>
          <h2 className='text-lg font-bold mb-2'>{t('filter')}</h2>

          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>{t('searchTitle')}</label>
            <Input
              type='text'
              placeholder={t('searchTitle')}
              className='w-full p-2 border rounded-full'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>{t('category')}</label>
            <select
              className='w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value=''>{t('all')}</option>
              {categories.map((e) => (
                <option value={e} key={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>{t('price')}</label>
            <select
              className='w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            >
              <option value=''>{t('select')}</option>
              <option value='lowToHigh'>{t('lowToHigh')}</option>
              <option value='highToLow'>{t('highToLow')}</option>
            </select>
          </div>

          <Button className='mt-2 w-full' onClick={clearFilter}>
            {t('clearFilter')}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 p-4'>
        <button
          onClick={() => setShow(true)}
          className='md:hidden bg-blue-500 text-white px-4 py-2 rounded-md mb-4 flex items-center gap-2'
        >
          <Filter size={18} /> {t('filterButton')}
        </button>

        {/* Product Grid */}
        {loading ? (
          <Loading />
        ) : (
          <div className='grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {product && product.length > 0 ? (
              product.map((e) => (
                <div key={e._id} className='flex justify-center'>
                  <ProductCard product={e} latest='No' />
                </div>
              ))
            ) : (
              <p className='text-center col-span-full'>{t('noProductsFound')}</p>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className='mt-6 mb-3 flex justify-center'>
          <Pagination>
            <PaginationContent className='flex gap-2'>
              {page !== 1 && (
                <PaginationItem className='cursor-pointer' onClick={prevPage}>
                  <PaginationPrevious />
                </PaginationItem>
              )}
              {page !== totalpages && (
                <PaginationItem className='cursor-pointer' onClick={nextPage}>
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
