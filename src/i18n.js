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
import enVerify from './locales/en/verify.json';
import enProductPage from './locales/en/productpage.json';
import enPayment from './locales/en/payment.json';
import enCatalogue from './locales/en/catalogue.json';
import enFooter from './locales/en/footer.json';

// Import Bengali (bn) namespaces
import bnCommon from './locales/bn/common.json';
import bnHome from './locales/bn/home.json';
import bnProduct from './locales/bn/product.json';
import bnCart from './locales/bn/cart.json';
import bnCheckout from './locales/bn/checkout.json';
import bnOrders from './locales/bn/orders.json';
import bnAuth from './locales/bn/auth.json';
import bnVerify from './locales/bn/verify.json';
import bnProductPage from './locales/bn/productpage.json';
import bnPayment from './locales/bn/payment.json';
import bnCatalogue from './locales/bn/catalogue.json';
import bnFooter from './locales/bn/footer.json';


i18n
  .use(LanguageDetector) // detects browser language, cookies, localStorage etc.
  .use(initReactI18next) // passes i18n instance to react-i18next
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
        productpage: enProductPage,
        payment: enPayment,
        catalogue:enCatalogue,
        footer:enFooter
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
        productpage: bnProductPage,
        payment: bnPayment,
        catalogue:bnCatalogue,
        footer:bnFooter,

      },
    },

    // ✅ Always fallback to English
    fallbackLng: 'en',

    // ✅ define default namespace
    defaultNS: 'common',

    // ✅ list of namespaces
    ns: [
      'common',
      'home',
      'product',
      'cart',
      'checkout',
      'orders',
      'auth',
      'verify',
      'productpage',
      'payment',
      'catalogue',
      'footer'
    ],

    interpolation: {
      escapeValue: false, // react already escapes by default
    },

    detection: {
      order: ['localStorage', 'cookie', 'navigator'], // check storage first, then browser
      caches: ['localStorage', 'cookie'],             // save user choice
      lookupLocalStorage: 'i18nextLng',
      lookupCookie: 'i18next',
    },

    supportedLngs: ['en', 'bn'], // only allow en & bn
    nonExplicitSupportedLngs: true, // map en-US → en, bn-IN → bn
  });

export default i18n;
