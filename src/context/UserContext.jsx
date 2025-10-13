import { server } from '@/main';
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  // Simple debug logger
  const log = (...args) => {
    if (typeof window !== 'undefined') console.log('[DEBUG:AUTH]', ...args);
  };

  // ✅ LOGIN USER (Send OTP)
  async function LoginUser(email) {
    setBtnLoading(true);
    const url = `${server}/api/user/login`;
    const body = { email };
    const startTime = Date.now();

    log('Sending OTP →', url);
    log('Request body:', body);

    try {
      const { data } = await axios.post(url, body, {
        timeout: 15000, // catch hangs
      });

      const duration = Date.now() - startTime;
      log('✅ OTP Response:', data, `(${duration}ms)`);

      toast.success(data.message);
      localStorage.setItem('email', email);
    } catch (error) {
      const duration = Date.now() - startTime;
      log('❌ OTP Error:', error);
      log('Duration:', `${duration}ms`);

      if (error.code === 'ECONNABORTED') {
        toast.error('Request timed out. Server not responding.');
      } else if (error.response) {
        toast.error(error.response.data?.message || 'Server returned an error.');
        log('Error Response Data:', error.response.data);
      } else if (error.request) {
        toast.error('No response received (network/CORS issue).');
        log('No Response (network/CORS):', error.request);
      } else {
        toast.error(error.message);
      }
    }
    setBtnLoading(false);
  }

  // ✅ VERIFY USER (Check OTP)
  async function verifyUser(otp, navigate, fetchCart) {
    setBtnLoading(true);
    const email = localStorage.getItem('email');
    const url = `${server}/api/user/verify`;
    const body = { email, otp };
    const startTime = Date.now();

    log('Verifying user →', url);
    log('Request body:', body);

    try {
      const { data } = await axios.post(url, body, {
        withCredentials: true,
        timeout: 15000,
      });

      const duration = Date.now() - startTime;
      log('✅ Verify Response:', data, `(${duration}ms)`);

      toast.success(data.message);
      localStorage.clear();
      setIsAuth(true);
      setUser(data.user);
      navigate('/');
      if (fetchCart) fetchCart();
    } catch (error) {
      const duration = Date.now() - startTime;
      log('❌ Verify Error:', error);
      log('Duration:', `${duration}ms`);

      if (error.code === 'ECONNABORTED') {
        toast.error('Verification timed out. Server not responding.');
      } else if (error.response) {
        toast.error(error.response.data?.message || 'Verification failed.');
        log('Error Response Data:', error.response.data);
      } else if (error.request) {
        toast.error('No response received (network/CORS issue).');
        log('No Response (network/CORS):', error.request);
      } else {
        toast.error(error.message);
      }
    }
    setBtnLoading(false);
  }

  // ✅ FETCH USER (get user info)
  async function fetchUser() {
    const url = `${server}/api/user/me`;
    log('Fetching user →', url);

    try {
      const { data } = await axios.get(url, {
        withCredentials: true,
        timeout: 10000,
      });
      setIsAuth(true);
      setUser(data);
      log('✅ User fetched:', data);
    } catch (error) {
      setIsAuth(false);
      if (error.response) {
        log('❌ Fetch user error:', error.response.status, error.response.data);
      } else {
        log('❌ Fetch user failed (no response / CORS):', error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  // ✅ LOGOUT USER
  async function logoutUser(navigate, setTotalItem) {
    const url = `${server}/api/user/logout`;
    log('Logging out →', url);

    try {
      await axios.post(url, {}, {
        withCredentials: true,
        timeout: 10000,
      });

      setUser([]);
      setIsAuth(false);
      setLoading(false);
      setTotalItem(0);
      toast.success('Logged Out');
      navigate('/');
      log('✅ Logout successful');
    } catch (error) {
      log('❌ Logout failed:', error);
      toast.error('Failed to logout.');
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        btnLoading,
        isAuth,
        LoginUser,
        verifyUser,
        logoutUser,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
