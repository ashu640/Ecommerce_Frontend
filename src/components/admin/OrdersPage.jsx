import { server } from '@/main';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Input } from '../ui/input';
import Loading from '../Loading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Link } from 'react-router-dom';
import moment from 'moment';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]); // for search
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [notify, setNotify] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // 🔑 Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const intervalRef = useRef(null);

  // Fetch paginated orders
  const fetchOrders = async (pageNum = 1) => {
    try {
      const { data } = await axios.get(
        `${server}/api/order/admin/all?page=${pageNum}&limit=${limit}`,
        { withCredentials: true }
      );

      setOrders(data.orders);
      setTotalPages(data.totalPages);
      setLoading(false);

      if (data.orders.length > 0) {
        const latest = data.orders.reduce(
          (max, order) =>
            new Date(order.updatedAt) > new Date(max) ? order.updatedAt : max,
          data.orders[0].updatedAt
        );
        setLastUpdate(latest);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Fetch ALL orders for searching
  const fetchAllOrders = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/order/admin/all`, // backend should allow no pagination if limit is very high
        { withCredentials: true }
      );
      setAllOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch all orders for search', error);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  useEffect(() => {
    fetchAllOrders(); // load all orders for search
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      try {
        const { data } = await axios.get(
          `${server}/api/orders/admin/last-update`,
          { withCredentials: true }
        );
        if (lastUpdate && data.lastUpdate && data.lastUpdate !== lastUpdate) {
          setNotify(true);
        }
      } catch (err) {
        console.error('Polling failed', err);
      }
    }, 30000);

    return () => clearInterval(intervalRef.current);
  }, [lastUpdate]);

  const updateOrderStatus = async (orderId, status) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/order/${orderId}`,
        { status },
        { withCredentials: true }
      );
      toast.success(data.message);
      fetchOrders(page);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
      setLoading(false);
    }
  };

  // If searching, filter from ALL orders; else show paginated
  const activeOrders = search
    ? allOrders.filter(
        (order) =>
          order.user.email.toLowerCase().includes(search.toLowerCase()) ||
          order._id.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-7xl mx-auto overflow-hidden">
      <h1 className="text-2xl font-bold">Manage Orders</h1>

      {notify && (
        <div className="bg-yellow-200 text-black p-2 rounded">
          ⚡ Orders have been updated — please refresh to see the latest changes.
        </div>
      )}

      <Input
        placeholder="Search by email or order id"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2"
      />

      {loading ? (
        <Loading />
      ) : activeOrders.length > 0 ? (
        <div className="space-y-4">
          {/* Desktop Table (lg and above) */}
          <div className="hidden lg:block rounded-lg border">
            <ScrollArea className="w-full h-[70vh]">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Id</TableHead>
                    <TableHead>User Email</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        <Link
                          to={`/order/${order._id}`}
                          className="text-blue-600 underline"
                        >
                          {order._id}
                        </Link>
                      </TableCell>
                      <TableCell>{order.user.email}</TableCell>
                      <TableCell>₹{order.subTotal}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-white capitalize ${
                            order.status === 'pending'
                              ? 'bg-yellow-500'
                              : order.status === 'shipped'
                              ? 'bg-blue-500'
                              : order.status === 'delivered'
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {moment(order.createdAt).format('DD-MM-YYYY')}
                      </TableCell>
                      <TableCell>
                        <select
                          value={order.status}
                          className="w-[150px] px-3 py-2 border rounded-md dark:bg-black"
                          onChange={(e) =>
                            updateOrderStatus(order._id, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {/* Mobile + iPad (cards) */}
          <div className="lg:hidden space-y-3">
            {activeOrders.map((order) => (
              <Card key={order._id} className="shadow-md border">
                <CardContent className="p-4 space-y-3">
                  <p>
                    <strong>Order Id:</strong>{' '}
                    <Link
                      to={`/order/${order._id}`}
                      className="text-blue-600 underline break-all"
                    >
                      {order._id}
                    </Link>
                  </p>
                  <p>
                    <strong>User Email:</strong>{' '}
                    <span className="break-all">{order.user.email}</span>
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{order.subTotal}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span
                      className={`px-2 py-1 rounded text-white capitalize ${
                        order.status === 'pending'
                          ? 'bg-yellow-500'
                          : order.status === 'shipped'
                          ? 'bg-blue-500'
                          : order.status === 'delivered'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                  <p>
                    <strong>Date:</strong>{' '}
                    {moment(order.createdAt).format('DD-MM-YYYY')}
                  </p>
                  <div>
                    <strong>Action:</strong>
                    <select
                      value={order.status}
                      className="w-full sm:w-[150px] px-3 py-2 border rounded-md mt-1 dark:bg-black"
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination (only when not searching) */}
          {!search && (
            <ScrollArea className="w-full">
              <div className="flex justify-center lg:justify-between items-center space-x-2 pt-4 min-w-max">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Prev
                </Button>

                <div className="flex space-x-2 overflow-x-auto">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      size="sm"
                      variant={page === i + 1 ? 'default' : 'outline'}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </ScrollArea>
          )}
        </div>
      ) : (
        <p>No Orders</p>
      )}
    </div>
  );
};

export default OrdersPage;
