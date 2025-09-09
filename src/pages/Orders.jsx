import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { server } from '@/main';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation('orders');
  const [cancelling, setCancelling] = useState(false);


  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${server}/api/order/all`, {
          withCredentials: true,
        });
        setOrders(data.orders);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Cancel order
  const cancelOrder = async (id) => {
    setCancelling(true);
    try {
      const { data } = await axios.post(
        `${server}/api/order/${id}/cancel`,
        {},
        { withCredentials: true }
      );

      // Update the order in state using backend response
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, ...data.order } : o
        )
      );

      toast.success(data.message || t('orderCanceled'));
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || t('cancelFailed'));
    }
    finally {
      setCancelling(false); // stop loading
    }
  };

  if (loading) return <Loading />;

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-gray-600">{t('noOrders')}</h1>
        <Button onClick={() => navigate('/products')}>{t('shopNow')}</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 min-h-[70vh]">
      <div className="text-3xl font-bold mb-6 text-center">
        {t('yourOrders')}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <Card
            key={order._id}
            className="shadow-sm hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {t('orderNumber')} #{order._id.toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>{t('status')}: </strong>
                <span
                  className={`${
                    order.status === 'pending'
                      ? 'text-yellow-500'
                      : order.status === 'cancelled'
                      ? 'text-red-500'
                      : order.status === 'shipped'
                      ? 'text-blue-500'
                      : 'text-green-500'
                  }`}
                >
                  {t(order.status.toLowerCase())}
                </span>
              </p>
              <p>
                <strong>{t('totalItems')}: </strong>
                {order.items?.length || 0}
              </p>
              <p>
                <strong>{t('subTotal')}: ₹</strong>
                {order.subTotal}
              </p>
              <p>
                <strong>{t('placedAt')}: </strong>
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => navigate(`/order/${order._id}`)}>
                  {t('viewDetails')}
                </Button>
                {/* Cancel button only if pending */}
                {order.status === 'pending' && (
                 
                 <Button
  variant="destructive"
  onClick={() => cancelOrder(order._id)}
  disabled={cancelling} // disable while request is pending
  className={`
    transition 
    duration-200 
    ease-in-out 
    ${cancelling ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700 active:bg-red-800'}
  `}
>
  {cancelling ? t('cancelling') : t('cancelOrder')}
</Button>

                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
