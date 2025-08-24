import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { LandingPage } from "./module/landing/page";
import { ShopkeeperDashboard } from "./module/shopkeeper/dashboard/page";
import { OrdersPage } from "./module/shopkeeper/order/page";
import { ProductsPage } from "./module/shopkeeper/product/page";
import { ShopOnboardingPage } from "./module/shopkeeper/onboarding/page";
import { NearbyShopsPage } from "./module/customer/NearbyShops/page";
import { ShopPage } from "./module/customer/shop/page";
import { CartPage } from "./module/customer/cart/page";
import { CheckoutPage } from "./module/customer/checkout/page";
import { AboutPage } from "./module/landing/trust-pages/common";
import { ContactPage, PrivacyPolicyPage, RefundPolicyPage, TermsConditionsPage } from "./module/landing/trust-pages/common";
import { Toaster } from 'react-hot-toast';
import InitialRouteHandler from "./components/wrappers/InitialRouteHandler";

// Unused 
// import { ShopAccessPage } from "./module/customer/shopAccess/page";
// import { ProductCatalog } from "./module/customer/productCatalog/page";
// import { CartPage } from "./module/customer/cart/page";
// import { CheckoutPage } from "./module/customer/checkout/page";

/**
 * Shopkeeper
 * Free: one device order+products etc
 * 50rs(one time): create shop, login, free email pdf daily
 * 10rs: run a shop
 * 30rs: remove ads
 * 10rs: whatsapp pdf daily
 * 30rs: sponsered shop
 * 
 */

/**
 * Customer
 * Free: 1km radius shops
 * Bronse: 5km radius shops
 * Silver: 10km radius shops
 * Gold: 20km radius shops
 * 
 */

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(54,54,54,0.7)',
            backdropFilter: 'blur(4px)',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Router>
        <InitialRouteHandler>
          <Routes>
            {/* Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* Customer Routes */}
            <Route path="/customer/nearby-shops" element={<NearbyShopsPage />} />
            {/* TODO: shop login/registration reminder popup & view cart floaring icon  */}
            <Route path="/customer/shop/:shopId" element={<ShopPage />} />
            <Route path="/customer/cart" element={<CartPage />} />
            <Route path="/customer/checkout" element={<CheckoutPage />} />

            {/* Shopkeeper Routes */}
            <Route path="/shop/onboarding" element={<ShopOnboardingPage />} />
            <Route path="/shop/dashboard" element={<ShopkeeperDashboard />} />
            <Route path="/shop/orders" element={<OrdersPage />} />
            <Route path="/shop/products" element={<ProductsPage />} />

            {/* Trust Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsConditionsPage />} />

            {/* 404 Fallback (optional) */}
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </InitialRouteHandler>
      </Router>
    </>
  );
}

export default App;
