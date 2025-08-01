import HomePage from '@/components/admin/HomePage';
import InfoPage from '@/components/admin/InfoPage';
import OrdersPage from '@/components/admin/OrdersPage';
import { Button } from '@/components/ui/button';
import { UserData } from '@/context/UserContext';
import { Home, Info, MenuIcon, ShoppingBag, X } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashBoard = () => {
  const [selectedPage, setSelectedPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
   const navigate=useNavigate()
   const {user}=UserData();
   if(user.role!=="admin"){
    return navigate("/");
    
   }
  const renderPageContent = () => {
    switch (selectedPage) {
      case "home":
        return <HomePage />;
      case "orders":
        return <OrdersPage />;
      case "info":
        return <InfoPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`w-64 fixed lg:relative lg:translate-x-0 z-50 transition-transform duration-300 bg-background/50 backdrop-blur shadow-lg h-full 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-4">
          <h1 className="text-lg font-bold mb-4">Admin Panel</h1>
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={() => setSelectedPage("home")}
              className={`w-full flex items-center gap-2 ${selectedPage === "home" ? "bg-gray-500 text-white" : ""}`}
            >
              <Home className="w-5 h-5" />
              Home
            </Button>
            <Button
              variant="ghost"
              onClick={() => setSelectedPage("orders")}
              className={`w-full flex items-center gap-2 ${selectedPage === "orders" ? "bg-gray-500 text-white" : ""}`}
            >
              <ShoppingBag className="w-5 h-5" />
              Orders
            </Button>
            <Button
              variant="ghost"
              onClick={() => setSelectedPage("info")}
              className={`w-full flex items-center gap-2 ${selectedPage === "info" ? "bg-gray-500 text-white" : ""}`}
            >
              <Info className="w-5 h-5" />
              Info
            </Button>
            <Button
              variant="ghost"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="shadow p-4 flex items-center justify-between lg:justify-end">
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MenuIcon className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-bold hidden lg:block">Admin Dashboard</h2>
        </div>

        {/* Page content */}
        <div className="p-4">{renderPageContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashBoard;
