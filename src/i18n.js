import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ================== English namespaces ==================
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
import enAdmin from './locales/en/admin.json';


// ================== Bengali namespaces ==================
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
import bnAdmin from './locales/bn/admin.json';


i18n
  .use(LanguageDetector) // detects language from localStorage, cookie, navigator
  .use(initReactI18next) // passes i18n to react-i18next
  .init({
    debug: false, // set true for development

    // ================== Translations ==================
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
        catalogue: enCatalogue,
        footer: enFooter,
        admin:enAdmin
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
        catalogue: bnCatalogue,
        footer: bnFooter,
        admin:bnAdmin
      },
    },

    // ================== Defaults ==================
    fallbackLng: 'en', // fallback if no language detected
    defaultNS: 'common',
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
      'footer',
      'admin'
    ],

    interpolation: {
      escapeValue: false, // React already escapes
    },

    // ================== Language detection ==================
    detection: {
      order: ['localStorage', 'cookie', 'navigator'], // detection priority
      caches: ['localStorage', 'cookie'],             // save selection
      lookupLocalStorage: 'i18nextLng',
      lookupCookie: 'i18next',
      checkWhitelist: true,
    },

    supportedLngs: ['en', 'bn'],
    nonExplicitSupportedLngs: true, // treats en-US → en, bn-IN → bn
  });

export default i18n;
