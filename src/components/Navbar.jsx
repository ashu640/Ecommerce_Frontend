import { LogIn, ShoppingCart, User } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from './ui/dropdown-menu';
import { ModeToggle } from './mode-toggle';
import { UserData } from '@/context/UserContext';
import { CartData } from '@/context/cartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const {isAuth,logoutUser,user}=UserData();
  const {totalItem,setTotalItem}=CartData()
  const logouthandler=()=>{
   logoutUser(navigate,setTotalItem);
  }
  console.log(user)

  return (
    <div className="z-50 sticky top-0 bg-background/50 border-b backdrop-blur">
      <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between">
        <h1 className="text-2xl font-bold">QuickCart</h1>

        <ul className="flex justify-center items-center space-x-6">
          <li className="cursor-pointer" onClick={() => navigate('/')}>
            Home
          </li>
          <li className="cursor-pointer" onClick={() => navigate('/products')}>
            Products
          </li>
          <li
            className="cursor-pointer relative flex items-center"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItem? totalItem:0}
            </span>
          </li>

          <li className="cursor-pointer">
            <DropdownMenu>
              <DropdownMenuTrigger>
                {isAuth ? <User /> : <LogIn />}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {!isAuth ? (
                  <DropdownMenuItem onClick={() => navigate('/login')}>
                    Login
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/orders')}>
                      Your Orders
                    </DropdownMenuItem>
                   { user && user.role==="admin" && (< DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                      DashBoard
                    </DropdownMenuItem>
)}
                    
                    <DropdownMenuItem onClick={logouthandler}>
                      Logout
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
          <ModeToggle></ModeToggle>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
