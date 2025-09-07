import { Button } from '@/components/ui/button';
import { CartData } from '@/context/cartContext';
import { server } from '@/main';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const OrderProcessing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const { fetchCart } = CartData();
  const { t } = useTranslation('orders');

  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');
  console.log("🔎 sessionId from URL:", sessionId);

  useEffect(() => {
    const checkOrderStatus = async () => {
      if (!sessionId) {
        toast.error(t("session_missing"));
        return navigate('/cart');
      }

      try {
        const { data } = await axios.get(
          `${server}/api/order/status/${sessionId}`,
          { withCredentials: true }
        );
        console.log("🔍 Order status response:", data);

        if (data.success) {
          setSuccess(true);
          fetchCart();
          toast.success(t("success_toast"));
        } else {
          toast.error(data.reason || t("failed_toast"));
          navigate('/cart');
        }
      } catch (err) {
        console.error("❌ Error checking order status:", err.response?.data || err.message);
        toast.error(err.response?.data?.message || t("failed_toast"));
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };

    checkOrderStatus();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-500">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-4">{t("processing_title")}</h1>
          <p className="text-lg text-gray-700 mb-6">{t("processing_message")}</p>
          <div className="animate-pulse text-2xl text-gray-600">⏳</div>
          <div className="text-xl text-gray-500 mt-2">{t("processing_subtext")}</div>
        </div>
      </div>
    );
  }

  return success ? (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <h1 className="text-4xl font-bold text-green-500 mb-4">{t("success_title")}</h1>
        <p className="text-gray-600 text-lg mb-6">{t("success_message")}</p>
        <Button onClick={() => navigate('/orders')}>{t("go_to_orders")}</Button>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">{t("failed_title")}</h1>
        <p className="text-gray-600 text-lg mb-6">{t("failed_message")}</p>
        <Button onClick={() => navigate('/cart')}>{t("try_again")}</Button>
      </div>
    </div>
  );
};

export default OrderProcessing;
