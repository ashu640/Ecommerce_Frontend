import { Button } from '@/components/ui/button';
import { CartData } from '@/context/cartContext';
import { server } from '@/main';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const OrderProcessing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const { fetchCart } = CartData();
  const { t } = useTranslation('orders');

  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        toast.error(t("session_missing"));
        return navigate('/cart');
      }
      if (paymentVerified) return;

      setLoading(true);
      try {
        const { data } = await axios.post(
          `${server}/api/order/verify/payment`,
          { sessionId },
          {
            withCredentials: true,
          }
        );

        if (data.success) {
          toast.success(t("success_toast"));
          setPaymentVerified(true);
          fetchCart();
          setLoading(false);
          setTimeout(() => {
            navigate('/orders');
          }, 5000);
        }
      } catch (error) {
        toast.error(t("failed_toast"));
        console.error(error);
        navigate('/cart');
      }
    };

    if (sessionId && !paymentVerified) {
      verifyPayment();
    }
  }, [sessionId, paymentVerified, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-500">
      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-4">{t("processing_title")}</h1>
          <p className="text-lg text-gray-700 mb-6">{t("processing_message")}</p>
          <div className="animate-pulse text-2xl text-gray-600">⏳</div>
          <div className="text-xl text-gray-500 mt-2">{t("processing_subtext")}</div>
        </div>
      ) : (
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <h1 className="text-4xl font-bold text-green-500 mb-4">{t("success_title")}</h1>
          <p className="text-gray-600 text-lg mb-6">
            {t("success_message")}
          </p>
          <Button onClick={() => navigate('/orders')}>
            {t("go_to_orders")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderProcessing;
