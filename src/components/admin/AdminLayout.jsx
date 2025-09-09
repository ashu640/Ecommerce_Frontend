// AdminLayout.jsx
import React from "react";
import Navbar from "@/components/Navbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar className="fixed top-0 left-0 w-full z-50" />
      <main className="flex-1 pt-20 px-4 md:px-6 w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
