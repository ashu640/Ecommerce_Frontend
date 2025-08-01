import { Button } from '@/components/ui/button';
import { CartData } from '@/context/cartContext';
import { server } from '@/main';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderProcessing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const { fetchCart } = CartData();

  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        toast.error('Session Id missing');
        return navigate('/cart');
      }
      if (paymentVerified) return;

      setLoading(true);
      try {
        const { data } = await axios.post(
          `${server}/api/order/verify/payment`,
          { sessionId },
          {
            headers: {
              token: Cookies.get('token'),
            },
          }
        );

        if (data.success) {
          toast.success('Order Placed Successfully');
          setPaymentVerified(true);
          fetchCart();
          setLoading(false);
          setTimeout(() => {
            navigate('/orders');
          }, 5000); // 5 seconds wait before redirect
        }
      } catch (error) {
        toast.error('Payment verification failed. Please try again');
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
          <h1 className="text-4xl font-extrabold text-blue-600 mb-4">Processing Order</h1>
          <p className="text-lg text-gray-700 mb-6">Please wait. Your payment is loading...</p>
          <div className="animate-pulse text-2xl text-gray-600">⏳</div>
          <div className="text-xl text-gray-500 mt-2">Processing...</div>
        </div>
      ) : (
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <h1 className="text-4xl font-bold text-green-500 mb-4">Order Placed</h1>
          <p className="text-gray-600 text-lg mb-6">
            Thank you for shopping with us. Your order will be delivered soon.
          </p>
          <Button onClick={() => navigate('/orders')}>Go to Orders Page</Button>
        </div>
      )}
    </div>
  );
};

export default OrderProcessing;
