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

  async function LoginUser(email, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, { email });
      toast.success(data.message);
      localStorage.setItem('email', email);
      navigate('/verify');
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setBtnLoading(false);
  }

  async function verifyUser(otp, navigate, fetchCart) {
    setBtnLoading(true);
    const email = localStorage.getItem('email');

    try {
      const { data } = await axios.post(
        `${server}/api/user/verify`,
        { email, otp },
        { withCredentials: true } // ✅ allow cookies to be stored
      );

      toast.success(data.message);
      localStorage.clear();
      navigate('/');
      setIsAuth(true);
      setUser(data.user);
      fetchCart();
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setBtnLoading(false);
  }

  async function fetchUser() {
    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        withCredentials: true, // ✅ send cookie with request
      });
      setIsAuth(true);
      setUser(data);
    } catch (error) {
      setIsAuth(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function logoutUser(navigate, setTotalItem) {
    try {
      // Call logout API with correct config
      await axios.post(`${server}/api/user/logout`, {}, {
        withCredentials: true, // correct: in config
      });
  
      // Clear client-side state
      setUser([]);
      setIsAuth(false);
      setLoading(false);
      setTotalItem(0);
      toast.success('Logged Out');
  
      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout');
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
