// src/pages/LandingPage.jsx
import React from "react";
import { Button } from "@/components/ui/button";

const Publisher = () => {
  return (
    <div className="min-h-screen flex flex-col">
  

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-gray-50">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Preserving Bengali Literature
        </h2>
        <p className="text-gray-600 max-w-xl mb-6">
          Welcome to <span className="font-semibold">Biswa Bangiya Prakashan</span>,  
          a home for Bengali and Bangladeshi books.  
          Explore our collection and experience the richness of literature.
        </p>
        <Button
          onClick={() => window.location.href = "#books"}
          className="px-6 py-3 text-lg rounded-xl"
        >
          Explore Books
        </Button>
      </section>

      {/* Footer */}
    
    </div>
  );
};

export default Publisher;
