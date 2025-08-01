import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

const App = () => {
  const { isAuth, loading } = UserData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/products' element={<Products />} />
            <Route path='/product/:id' element={<ProductPage />} />
            <Route path='/cart' element={isAuth ? <Cart /> : <Login />} />
            <Route path='/orders' element={isAuth ? <Orders /> : <Login />} />
            <Route path='/order/:id' element={isAuth ? <OrderPage /> : <Login />} />
            <Route path='/admin/dashboard' element={isAuth ? <AdminDashBoard /> : <Login />} />
            <Route path='/checkout' element={isAuth ? <Checkout /> : <Login />} />
            <Route path='/payment/:id' element={isAuth ? <Payment /> : <Login />} />
            <Route path='/ordersuccess' element={isAuth ? <OrderProcessing /> : <Login />} />
            <Route path='/login' element={isAuth ? <Home /> : <Login />} />
            <Route path='/verify' element={isAuth ? <Home /> : <Verify />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
