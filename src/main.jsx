import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/theme-provider'
import { UserProvider } from './context/UserContext.jsx'
import { ProductProvider } from './context/productContext'
import { CartProvider } from './context/cartContext'
import './i18n';
import { BrowserRouter } from "react-router-dom";

// export const server = "https://ecommerce-15v7.onrender.com";
// export const server = "http://localhost:5000";
export const server = "https://ecommerce-production-2ef9.up.railway.app";

export const categories = [
  "Electronics",
  "Mobile Phones & Accessories",
  "Laptops & Computers",
  "Tablets & iPads",
  "Audio Devices",
  "Cameras & Accessories",
  "Wearables",
  "Gaming Consoles",
  "Power Banks & Chargers",

  "Fashion & Clothing",
  "Men’s Clothing",
  "Women’s Clothing",
  "Kids’ Clothing",
  "Innerwear & Loungewear",
  "Ethnic Wear",
  "Winterwear",
  "Footwear",

  "Home & Kitchen",
  "Kitchen Appliances",
  "Cookware & Serveware",
  "Bedding & Linen",
  "Furniture",
  "Home Decor",
  "Lighting & Lamps",
  "Storage & Organization",

  "Beauty & Personal Care",
  "Skincare",
  "Haircare",
  "Makeup & Cosmetics",
  "Fragrances & Deodorants",
  "Grooming Kits",
  "Bath & Body",
  "Oral Care",

  "Health & Wellness",
  "Fitness Equipment",
  "Vitamins & Supplements",
  "Healthcare Devices",
  "Ayurveda & Herbal Products",
  "Sexual Wellness",
  "Sanitizers & Masks",

  "Groceries & Food",
  "Staples",
  "Beverages",
  "Snacks & Packaged Food",
  "Dairy & Eggs",
  "Organic & Gourmet",
  "Baby Food",

  "Books and Stationery",
  "Fiction & Non-Fiction",
  "School & College Books",
  "Competitive Exam Books",
  "Notebooks & Diaries",
  "Art Supplies",
  "Office Stationery",

  "Toys & Baby Products",
  "Toys & Games",
  "Baby Care Essentials",
  "Baby Gear",
  "Kids’ Apparel",
  "Diapers & Wipes",

  "Sports & Fitness",
  "Gym Equipment",
  "Outdoor Sports",
  "Indoor Games",
  "Fitness Apparel",
  "Nutrition Products",

  "Automobile Accessories",
  "Car Accessories",
  "Bike Accessories",
  "Helmets",
  "Oils & Lubricants",
  "Car Electronics",

  "Jewelry & Watches",
  "Imitation Jewelry",
  "Gold & Silver Jewelry",
  "Smartwatches",
  "Luxury Watches",
  "Accessories",

  "Pet Supplies",
  "Dog Food & Accessories",
  "Cat Food & Accessories",
  "Pet Grooming",
  "Pet Health Products",
  "Fish & Aquatic",

  "Tools & Hardware",
  "Power Tools",
  "Hand Tools",
  "Electricals",
  "Plumbing & Fittings",
  "Home Improvement",

  "Gift Items",
  "Personalized Gifts",
  "Gift Cards",
  "Handicrafts",
  "DIY Gift Kits",

  "Digital Products",
  "eBooks",
  "Software",
  "Online Subscriptions",
  "Digital Gift Cards"
];

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <ProductProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </ProductProvider>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
