import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CartData } from '@/context/cartContext';
import { server } from '@/main';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { useTranslation } from 'react-i18next';

const Payment = () => {
  const { cart, subTotal, fetchCart } = CartData();
  const [address, setAddress] = useState('');
  const [method, setMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, i18n } = useTranslation("payment"); // <-- i18n hook

  async function fetchAddress() {
    try {
      const { data } = await axios.get(`${server}/api/address/${id}`, {
        withCredentials: true,
      });
      setAddress(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAddress();
  }, [id]);

  const paymentHandler = async () => {
    if (!method || !address) return;

    if (method === 'cod') {
      setLoading(true);
      try {
        const { data } = await axios.post(
          `${server}/api/order/new/cod`,
          {
            method,
            phone: address.phone,
            address: address.address,
          },
          {
            withCredentials: true,
          }
        );
        setLoading(false);
        toast.success(data.message);
        fetchCart();
        navigate('/orders');
      } catch (error) {
        setLoading(false);
        toast.error(error.response?.data?.message || t('codFailed'));
      }
    }

    if (method === 'online') {
      const stripePromise = loadStripe('pk_test_51Rq9Mp1bCIi4nPxeQdsv3U03OkDpEGcLaiyZ0R2eRQ2xFKyNHGQBB0iVr2wmhXse3fdHTALHmrrJDaBVxWXtyFXT00Lk5JLGRT');
      try {
        setLoading(true);
        const stripe = await stripePromise;

        const { data } = await axios.post(
          `${server}/api/order/new/online`,
          {
            method,
            phone: address.phone,
            address: address.address,
          },
          {
            withCredentials: true,
          }
        );

        if (data.url) {
          window.location.href = data.url;
        } else {
          toast.error(t('sessionFailed'));
        }
        setLoading(false);
      } catch (error) {
        toast.error(t('paymentFailed'));
        setLoading(false);
      }
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">{t('title')}</h2>

            <div>
              <h3 className="text-xl font-semibold">{t('products')}</h3>
              <Separator className="my-2" />
              <div className="space-y-4">
                {cart &&
                  cart.map((e, i) => (
                    <div
                      key={i}
                      className="flex flex-col md:flex-row items-center justify-between bg-card p-4 rounded-lg shadow border dark:border-gray-700"
                    >
                      <img
                        src={e.product.images[0]?.url}
                        alt="xyz"
                        className="w-16 h-16 object-cover rounded mb-4 md:mb-0"
                      />
                      <div className="flex-1 md:ml-4 text-center md:text-left">
                        {/* ✅ FIX: show title in current language */}
                        <h2 className="text-lg font-medium">
                          {e.product.title[i18n.language]}
                        </h2>

                        <p className="text-sm text-muted-foreground dark:text-gray-400">
                          ₹ {e.product.price} x {e.quantity}
                        </p>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">
                          ₹ {e.product.price * e.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="text-lg font-medium text-center">
              {t('total')}: ₹{subTotal}
            </div>

            {address && (
              <div className="bg-card p-4 rounded-lg shadow border space-y-4 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-center">{t('details')}</h3>
                <Separator className="my-2" />
                <div className="flex flex-col space-y-0">
                  <h4 className="font-semibold mb-1">{t('deliveryAddress')}</h4>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    <strong>{t('address')}:</strong> {address.address}
                  </p>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    <strong>{t('phone')}:</strong> {address.phone}
                  </p>
                </div>

                <div className="w-full md:w-1/2">
                  <h4 className="font-semibold mb-1">{t('selectMethod')}</h4>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-card dark:bg-gray-900 dark:text-white"
                  >
                    <option value="">{t('selectOption')}</option>
                    <option value="cod">{t('cod')}</option>
                    <option value="online">{t('online')}</option>
                  </select>
                </div>
              </div>
            )}

            <Button
              className="w-full py-3 mt-4"
              onClick={paymentHandler}
              disabled={!method || !address}
            >
              {method === 'cod'
                ? t('placeOrder')
                : method === 'online'
                ? t('proceedOnline')
                : t('selectBtn')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
