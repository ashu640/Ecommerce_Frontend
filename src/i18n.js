import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import English namespaces
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enProduct from './locales/en/product.json';
import enCart from './locales/en/cart.json';
import enCheckout from './locales/en/checkout.json';
import enOrders from './locales/en/orders.json';
import enAuth from './locales/en/auth.json';
import enVerify from './locales/en/verify.json'
import enProductPage from './locales/en/productpage'
// Import Bengali (bn) namespaces
import bnCommon from './locales/bn/common.json';
import bnHome from './locales/bn/home.json';
import bnProduct from './locales/bn/product.json';
import bnCart from './locales/bn/cart.json';
import bnCheckout from './locales/bn/checkout.json';
import bnOrders from './locales/bn/orders.json';
import bnAuth from './locales/bn/auth.json';
import bnVerify from './locales/bn/verify.json';
import bnProductPage from './locales/bn/productpage'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    resources: {
      en: {
        common: enCommon,
        home: enHome,
        product: enProduct,
        cart: enCart,
        checkout: enCheckout,
        orders: enOrders,
        auth: enAuth,
        verify: enVerify,
        productpage: enProductPage
      },
      bn: {
        common: bnCommon,
        home: bnHome,
        product: bnProduct,
        cart: bnCart,
        checkout: bnCheckout,
        orders: bnOrders,
        auth: bnAuth,
        verify: bnVerify,
        productpage:bnProductPage
      }
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'home', 'product', 'cart', 'checkout', 'orders', 'auth','verify','productpage'],
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
