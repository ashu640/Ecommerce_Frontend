import HomePage from '@/components/admin/HomePage';
import InfoPage from '@/components/admin/InfoPage';
import OrdersPage from '@/components/admin/OrdersPage';
import { Button } from '@/components/ui/button';
import { UserData } from '@/context/UserContext';
import { Home, Info, MenuIcon, ShoppingBag, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AdminDashBoard = () => {
  const [selectedPage, setSelectedPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = UserData();
  const navigate = useNavigate();
  const { t } = useTranslation('admin');

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

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
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`w-64 fixed lg:justify lg:translate-x-0 z-50 transition-transform duration-300 bg-background/70 backdrop-blur shadow-lg h-full 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full p-4">
          <h1 className="text-lg font-bold mb-6">{t("adminPanel")}</h1>
          <div className="space-y-3">
            <Button
              variant="ghost"
              onClick={() => setSelectedPage("home")}
              className={`w-full flex items-center gap-2 justify-start ${
                selectedPage === "home" ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              <Home className="w-5 h-5" />
              <span>{t("home")}</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => setSelectedPage("orders")}
              className={`w-full flex items-center gap-2 justify-start ${
                selectedPage === "orders" ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{t("orders")}</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => setSelectedPage("info")}
              className={`w-full flex items-center gap-2 justify-start ${
                selectedPage === "info" ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              <Info className="w-5 h-5" />
              <span>{t("info")}</span>
            </Button>

            <Button
              variant="ghost"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
              <span>{t("close")}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-2 flex flex-col lg:ml-64">
        {/* Header */}
        <div className="shadow p-4 flex items-center justify-between lg:justify-end bg-background">
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MenuIcon className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-bold hidden lg:block">{t("adminDashboard")}</h2>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderPageContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;
