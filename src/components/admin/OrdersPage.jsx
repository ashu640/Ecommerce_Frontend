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
  const [allOrders, setAllOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [notify, setNotify] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const intervalRef = useRef(null);

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

  const fetchAllOrders = async () => {
    try {
      const { data } = await axios.get(`${server}/api/order/admin/all`, {
        withCredentials: true,
      });
      setAllOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch all orders for search', error);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  useEffect(() => {
    fetchAllOrders();
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

  const activeOrders = search
    ? allOrders.filter(
        (order) =>
          order.user.email.toLowerCase().includes(search.toLowerCase()) ||
          order._id.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-3 sm:p-4 lg:p-6 border-b bg-background">
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-xl sm:text-2xl font-bold truncate">Manage Orders</h1>

          {notify && (
            <div className="bg-yellow-200 text-black p-2 rounded text-xs sm:text-sm">
              ⚡ Orders have been updated — please refresh to see the latest changes.
            </div>
          )}

          <Input
            placeholder="Search by email or order id"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loading />
          </div>
        ) : activeOrders.length > 0 ? (
          <div className="h-full flex flex-col">
            {/* Desktop Table - Hidden on mobile/tablet */}
            <div className="hidden xl:block flex-1 overflow-hidden">
              <ScrollArea className="h-full w-full">
                <div className="min-w-full">
                  <Table className="w-full">
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        <TableHead className="w-[140px]">Order Id</TableHead>
                        <TableHead className="w-[200px]">User Email</TableHead>
                        <TableHead className="w-[100px]">Total</TableHead>
                        <TableHead className="w-[120px]">Status</TableHead>
                        <TableHead className="w-[120px]">Date</TableHead>
                        <TableHead className="w-[160px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeOrders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-mono text-xs">
                            <Link
                              to={`/order/${order._id}`}
                              className="text-blue-600 hover:underline block truncate max-w-[120px]"
                              title={order._id}
                            >
                              {order._id}
                            </Link>
                          </TableCell>
                          <TableCell className="max-w-[180px] truncate" title={order.user.email}>
                            {order.user.email}
                          </TableCell>
                          <TableCell className="font-semibold">₹{order.subTotal}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-white capitalize text-xs ${
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
                          <TableCell className="text-sm">
                            {moment(order.createdAt).format('DD-MM-YYYY')}
                          </TableCell>
                          <TableCell>
                            <select
                              value={order.status}
                              className="w-[140px] px-2 py-1 border rounded-md dark:bg-black text-sm"
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
                </div>
              </ScrollArea>
            </div>

            {/* Mobile/Tablet Cards - Shown on mobile and tablet */}
            <div className="xl:hidden flex-1 overflow-hidden">
              <ScrollArea className="h-full w-full">
                <div className="p-3 sm:p-4 space-y-3">
                  {activeOrders.map((order) => (
                    <Card key={order._id} className="shadow-sm border w-full">
                      <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Order ID</span>
                            <Link
                              to={`/order/${order._id}`}
                              className="block text-blue-600 hover:underline font-mono text-xs break-all mt-1"
                            >
                              {order._id}
                            </Link>
                          </div>
                          
                          <div>
                            <span className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Email</span>
                            <p className="break-all mt-1">{order.user.email}</p>
                          </div>

                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Total</span>
                              <p className="font-semibold mt-1">₹{order.subTotal}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Date</span>
                              <p className="text-sm mt-1">{moment(order.createdAt).format('DD-MM-YYYY')}</p>
                            </div>
                          </div>

                          <div>
                            <span className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Status</span>
                            <div className="mt-1">
                              <span
                                className={`inline-block px-2 py-1 rounded text-white capitalize text-xs ${
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
                            </div>
                          </div>

                          <div>
                            <span className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Update Status</span>
                            <select
                              value={order.status}
                              className="w-full px-3 py-2 border rounded-md mt-1 dark:bg-black text-sm"
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Fixed Pagination Footer */}
            {!search && (
              <div className="flex-shrink-0 border-t bg-background">
                <ScrollArea className="w-full">
                  <div className="flex justify-center items-center space-x-2 p-3 sm:p-4 min-w-max">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="text-xs sm:text-sm"
                    >
                      Prev
                    </Button>

                    <div className="flex space-x-1 sm:space-x-2 max-w-[200px] sm:max-w-none overflow-x-auto">
                      {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            size="sm"
                            variant={page === pageNum ? 'default' : 'outline'}
                            onClick={() => setPage(pageNum)}
                            className="text-xs sm:text-sm min-w-[32px] sm:min-w-[36px]"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      {totalPages > 5 && page < totalPages - 2 && (
                        <>
                          <span className="px-2 text-muted-foreground">...</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPage(totalPages)}
                            className="text-xs sm:text-sm"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="text-xs sm:text-sm"
                    >
                      Next
                    </Button>
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No Orders</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;