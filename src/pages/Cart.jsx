import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CartData } from '@/context/cartContext';
import { Trash } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Cart = () => {
  const { cart, totalItem, subTotal, updateCart, removeFromCart } = CartData();
  const navigate = useNavigate();
  const { t } = useTranslation('cart');

  const updateCartHandler = async (action, id) => {
    await updateCart(action, id);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6 text-center'>{t('yourCart')}</h1>

      {cart.length === 0 ? (
        <div className='text-center py-10'>
          <p className='text-xl'>{t('cartEmpty')}</p>
          <Button className='mt-6' onClick={() => navigate("/products")}>
            {t('shopNow')}
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {cart.map((e) => (
              <div key={e._id} className="flex flex-col sm:flex-row items-center sm:items-stretch space-y-4 sm:space-y-0 sm:space-x-4 shadow-md rounded-lg p-4 border border-gray-400">
                <img
                  src={e.product.images[0].url}
                  alt={e.product.title}
                  className='w-full sm:w-20 sm:h-20 object-cover rounded-md cursor-pointer'
                  onClick={() => navigate(`/product/${e.product._id}`)}
                />
                <div className="flex-1 text-center sm:text-left">
                  <h2 className='text-lg font-medium'>{e.product.title}</h2>
                  <p>{t('price')}: ₹{e.product.price}</p>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Button variant="outline" size="sm" onClick={() => updateCartHandler("dec", e._id)}>-</Button>
                  <span className='text-center'>{e.quantity}</span>
                  <Button variant="outline" size="sm" onClick={() => updateCartHandler("inc", e._id)}>+</Button>
                </div>
                <Button variant="ghost" className="text-red-600" onClick={() => removeFromCart(e._id)}>
                  <Trash className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>

          <div className="p-6 shadow-lg rounded-lg border border-gray-400">
            <h2 className='text-xl font-semibold mb-4 text-center lg:text-left'>{t('orderSummary')}</h2>
            <Separator className="my-2" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t('totalItems')}: {totalItem}</span>
                <span>{t('totalPrice')}: ₹{subTotal}</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-medium text-lg">
              <span>{t('total')}:</span>
              <span>₹{subTotal}</span>
            </div>
            <Button
              className="w-full mt-6"
              onClick={() => navigate("/checkout")}
              disabled={cart.length === 0}
            >
              {t('checkout')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
