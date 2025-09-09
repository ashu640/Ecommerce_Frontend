import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CartData } from '@/context/cartContext';
import { server } from '@/main';
import axios from 'axios';
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
  const { t, i18n } = useTranslation("payment");

  async function fetchAddress() {
    try {
      const { data } = await axios.get(`${server}/api/address/${id}`, { withCredentials: true });
      console.log("📦 Address fetched:", data);
      setAddress(data);
    } catch (error) {
      console.error("❌ Error fetching address:", error.response?.data || error.message);
    }
  }

  useEffect(() => {
    fetchAddress();
  }, [id]);

  const paymentHandler = async () => {
    if (!method || !address) {
      toast.error("Please select payment method & address");
      return;
    }

    if (method === 'cod') {
      setLoading(true);
      try {
        const { data } = await axios.post(
          `${server}/api/order/new/cod`,
          { method, addressId: address._id },
          { withCredentials: true }
        );
        console.log("✅ COD order response:", data);
        toast.success(data.message);
        fetchCart();
        navigate('/orders');
      } catch (error) {
        console.error("❌ COD order error:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || t('codFailed'));
      } finally {
        setLoading(false);
      }
    }

    if (method === 'online') {
      const stripePromise = loadStripe('pk_test_51Rq9Mp1bCIi4nPxeQdsv3U03OkDpEGcLaiyZ0R2eRQ2xFKyNHGQBB0iVr2wmhXse3fdHTALHmrrJDaBVxWXtyFXT00Lk5JLGRT');
      try {
        setLoading(true);
        const stripe = await stripePromise;
        const { data } = await axios.post(
          `${server}/api/order/new/online`,
          { method, addressId: address._id },
          { withCredentials: true }
        );
        console.log("✅ Online order response:", data);
        if (data.url) {
          window.location.href = data.url;
        } else {
          toast.error(data.message || t('sessionFailed'));
        }
      } catch (error) {
        console.error("❌ Online payment error:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || t('paymentFailed'));
      } finally {
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

            {/* Products */}
            <div>
              <h3 className="text-xl font-semibold">{t('products')}</h3>
              <Separator className="my-2" />
              <div className="space-y-4">
                {cart && cart.map((e, i) => (
                  <div key={i} className="flex flex-col md:flex-row items-center justify-between bg-card p-4 rounded-lg shadow border">
                    <img src={e.product.images[0]?.url} alt={e.product.title[i18n.language]} className="w-16 h-16 rounded-md object-cover" />
                    <p className="font-semibold">{e.product.title[i18n.language]}</p>
                    <p>{e.quantity} x ₹{e.product.price} = ₹{e.quantity * e.product.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-xl font-semibold">{t('delivery_address')}</h3>
              <Separator className="my-2" />
              {address && (
                <div className="bg-card p-4 rounded-lg shadow border">
                  <p><strong>{t('address')}:</strong> {address.address}, {address.city}, {address.country}, {address.pinCode}</p>
                  <p><strong>{t('phone')}:</strong> {address.phone}</p>
                </div>
              )}
            </div>

            {/* Payment Method Dropdown */}
            <div>
              <h3 className="text-xl font-semibold">{t('payment_method')}</h3>
              <Separator className="my-2" />
              <select
  value={method}
  onChange={(e) => setMethod(e.target.value)}
  className="w-full p-2 border rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
>
  <option value="">{t('select_method')}</option>
  <option value="cod">{t('cod')}</option>
  <option value="online">{t('online')}</option>
</select>
            </div>

            {/* Pay Now / Order Now Button */}
            <div>
              <h3 className="text-xl font-semibold">{t('total')} ₹{subTotal}</h3>
              <Separator className="my-2" />
              <Button
                onClick={paymentHandler}
                disabled={!method || !address}
                className="w-full"
              >
                {method === 'cod'
                  ? t('order_now')
                  : method === 'online'
                  ? t('pay_now')
                  : t('select_method_first')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
