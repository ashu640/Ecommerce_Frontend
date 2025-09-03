import { server } from '@/main';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState, useRef } from 'react'
import { Input } from '../ui/input';
import Loading from '../Loading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Link } from 'react-router-dom';
import moment from 'moment';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState("")
  const [loading,setLoading]=useState(true);
  const [notify, setNotify] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const intervalRef = useRef(null);

  const fetchOrders=async()=>{
    try {
      const {data}=await axios.get(`${server}/api/order/admin/all`,{
        withCredentials: true
      })
      setOrders(data);
      setLoading(false);

      // ✅ capture the latest updatedAt when fetching orders
      if (data.length > 0) {
        const latest = data.reduce((max, order) => 
          new Date(order.updatedAt) > new Date(max) ? order.updatedAt : max, 
          data[0].updatedAt
        );
        setLastUpdate(latest);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchOrders();
  },[]);

  // ✅ Polling logic
  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      try {
        const { data } = await axios.get(`${server}/api/orders/admin/last-update`, {
          withCredentials: true,
        });
        if (lastUpdate && data.lastUpdate && data.lastUpdate !== lastUpdate) {
          setNotify(true); // show refresh banner
        }
      } catch (err) {
        console.error("Polling failed", err);
      }
    }, 30000); // poll every 30s

    return () => clearInterval(intervalRef.current);
  }, [lastUpdate]);

  const updateOrderStatus=async(orderId,status)=>{
    setLoading(true);
    try {
      const {data}=await axios.post(`${server}/api/order/${orderId}/status`,{status},{
        withCredentials: true
      })
      toast.success(data.message)
      fetchOrders()
      setLoading(false)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const filterOrders = orders.filter((order) =>
    order.user.email.toLowerCase().includes(search.toLowerCase()) ||
    order._id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='p-4 md:p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Manage Orders</h1>

      {notify && (
        <div className="bg-yellow-200 text-black p-2 rounded">
          ⚡ Orders have been updated — please refresh to see the latest changes.
        </div>
      )}

      <Input
        placeholder="Search by email or order id"
        value={search}
        onChange={e=>setSearch(e.target.value)}
        className='w-full md:w-1/2'
      />

      {
        loading ? (
          <Loading/>
        ) : filterOrders.length>0 ? (
          <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
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
                {filterOrders.map((order)=>(
                  <TableRow key={order._id}>
                    <TableCell>
                      <Link to={`/order/${order._id}`}>{order._id}</Link>
                    </TableCell>
                    <TableCell>
                      {order.user.email}
                    </TableCell>
                    <TableCell>
                      ₹{order.subTotal}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-white 
                        ${order.status==="pending" ? "bg-yellow-500" 
                        : order.status==="shipped" ? "bg-blue-500" 
                        : order.status==="delivered" ? "bg-green-500" 
                        : "bg-red-500"}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {moment(order.createdAt).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell>
                      <select
                        value={order.status}
                        className='w-[150px] px-3 py-2 border rounded-md'
                        onChange={(e)=>updateOrderStatus(order._id,e.target.value)}
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
        ) : (
          <p>No Orders</p>
        )
      }
    </div>
  )
}

export default OrdersPage
