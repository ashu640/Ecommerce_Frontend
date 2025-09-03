import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import { UserData } from './context/UserContext.jsx'
import Verify from './pages/Verify.jsx'
import Loading from './components/Loading.jsx'
import Products from './pages/Products.jsx'
import Cart from './pages/Cart.jsx'
import NotFound from './pages/NotFound.jsx'
import ProductPage from './pages/ProductPage.jsx'
import Checkout from './pages/Checkout.jsx'
import Payment from './pages/Payment.jsx'
import OrderProcessing from './pages/OrderProcessing.jsx'
import Orders from './pages/Orders.jsx'
import OrderPage from './pages/OrderPage.jsx'
import AdminDashBoard from './pages/AdminDashBoard.jsx'
import Scrolltop from './components/scrolltop.jsx'
import Catalogue from './pages/Catalogue.jsx'
import ContactUs from './pages/ContactUs.jsx'
import Publisher from './pages/Publisher.jsx'
import BlogPage from './pages/Blog.jsx'

const App = () => {
  const { isAuth, loading } = UserData();

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <Scrolltop></Scrolltop>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/blog' element={<BlogPage></BlogPage>} />
        <Route path='/contactus' element={<ContactUs></ContactUs>} />
        <Route path='/publisher' element={<Publisher></Publisher>} />
        <Route path='/product/:id' element={<ProductPage />} />
        <Route path='/catalogue' element={<Catalogue/>} />
        <Route path='/cart' element={isAuth ? <Cart /> : <Login />} />
        <Route path='/orders' element={isAuth ? <Orders /> : <Login />} />
        <Route path='/order/:id' element={isAuth ? <OrderPage /> : <Login />} />
        <Route path='/admin/dashboard' element={isAuth ? <AdminDashBoard /> : <Login />} />
        <Route path='/checkout' element={isAuth ? <Checkout /> : <Login />} />
        <Route path='/payment/:id' element={isAuth ? <Payment /> : <Login />} />
        <Route path='/ordersuccess' element={isAuth ? <OrderProcessing /> : <Login />} />
      
  
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
