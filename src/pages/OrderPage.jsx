import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserData } from '@/context/UserContext';
import { server } from '@/main';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const OrderPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = UserData();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${server}/api/order/${id}`, {
          headers: {
            token: Cookies.get('token'),
          },
        });
        setOrder(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-red-600">No orders with this id</h1>
        <Button onClick={() => navigate('/products')}>Shop Now</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {user._id === order.user._id || user.role === 'admin' ? (
        <>
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">Order Details</CardTitle>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTimeout(() => window.print(), 300);
                  }}
                >
                  Print Order
                </Button>
              </div>
            </CardHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
              <div>
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <p><strong>Order ID:</strong> {order._id}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={order.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}>
                    {order.status}
                  </span>
                </p>
                <p><strong>Total Items:</strong> {order.items.length}</p>
                <p><strong>Payment Method:</strong> {order.method}</p>
                <p><strong>Sub Total: ₹</strong> {order.subTotal}</p>
                <p><strong>Placed At:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Paid At:</strong> {order.paidAt || 'Payment Through COD'}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>User:</strong> {order.user?.email || 'Guest User'}</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {order.items.map((e, i) => (
              <Card key={i} className="overflow-hidden shadow-md">
                <Link to={`/product/${e.product._id}`}>
                  <img
                    src={e.product.images[0]?.url}
                    alt={e.product.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </Link>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{e.product.title}</h3>
                  <p><strong>Quantity:</strong> {e.quantity}</p>
                  <p><strong>Price:</strong> ₹{e.product.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <p className="text-red-500 text-3xl text-center">
          Not Accessible <Link to="/">Go to Home page</Link>
        </p>
      )}
    </div>
  );
};

export default OrderPage;
