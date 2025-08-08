import { server } from '@/main';
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const cartContext = createContext();

export const CartProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [cart, setCart] = useState([]);

  async function fetchCart() {
    try {
      const { data } = await axios.get(`${server}/api/cart/all`, {
        withCredentials: true,
      });
      setCart(data.cart);
      setTotalItem(data.sumOfQuantities);
      setSubTotal(data.subTotal);
    } catch (error) {
      console.log(error);
    }
  }

  async function addToCart(product) {
    try {
      const { data } = await axios.post(
        `${server}/api/cart/add`,
        { product },
        { withCredentials: true }
      );
      toast.success(data.message);
      fetchCart();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function updateCart(action, id) {
    try {
      const { data } = await axios.post(
        `${server}/api/cart/update?action=${action}`,
        { id },
        { withCredentials: true }
      );
      fetchCart();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function removeFromCart(id) {
    try {
      const { data } = await axios.get(
        `${server}/api/cart/remove/${id}`,
        { withCredentials: true }
      );
      toast.success(data.message);
      fetchCart();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <cartContext.Provider
      value={{
        cart,
        totalItem,
        subTotal,
        fetchCart,
        addToCart,
        setTotalItem,
        updateCart,
        removeFromCart,
      }}
    >
      {children}
    </cartContext.Provider>
  );
};

export const CartData = () => useContext(cartContext);
