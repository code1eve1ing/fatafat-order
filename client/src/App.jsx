import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { LandingPage } from "./module/landing/page";
import { ShopkeeperDashboard } from "./module/shopkeeper/dashboard/page";
import { OrdersPage } from "./module/shopkeeper/order/page";
import { ProductsPage } from "./module/shopkeeper/product/page";
import { ShopOnboardingPage } from "./module/shopkeeper/onboarding/page";
import { NearbyShopsPage } from "./module/customer/NearbyShops/page";
import { ShopsPage } from "./module/customer/shops/page";
import { ShopPage } from "./module/customer/shop/page";
import { CartPage } from "./module/customer/cart/page";
import { CheckoutPage } from "./module/customer/checkout/page";
import { OrderConfirmationPage } from "./module/customer/order-confirmation/page";
import { AboutPage } from "./module/landing/trust-pages/common";
import { ContactPage, PrivacyPolicyPage, RefundPolicyPage, TermsConditionsPage } from "./module/landing/trust-pages/common";
import { Toaster } from 'react-hot-toast';
import InitialRouteHandler from "./components/wrappers/InitialRouteHandler";
import { CategoriesPage } from "./module/admin/category/page";
import { AreaPage } from "./module/admin/area/page";
import InitialDataLoader from "./components/common/InitialDataLoader";
import ShopkeeperManager from "./module/shopkeeper/wrappers/ShopkeeperManager";
import StateViewer from "./components/common/StateViewer";
import { ShopDataWrapper } from "./module/customer/wrappers/ShopDataWrapper";

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
            <Route path="/shops" element={<ShopsPage />} />
            <Route path="/customer/nearby-shops" element={<NearbyShopsPage />} />
            {/* TODO: shop login/registration reminder popup & view cart floaring icon  */}
            <Route path="/customer/shop/:shopId" element={<ShopDataWrapper><ShopPage /></ShopDataWrapper>} />
            <Route path="/customer/shop/:shopId/cart" element={<ShopDataWrapper><CartPage /></ShopDataWrapper>} />
            <Route path="/customer/shop/:shopId/checkout" element={<ShopDataWrapper><CheckoutPage /></ShopDataWrapper>} />
            <Route path="/customer/shop/:shopId/order-confirmation" element={<ShopDataWrapper><OrderConfirmationPage /></ShopDataWrapper>} />

            {/* Shopkeeper Routes */}
            <Route path="/shop/onboarding" element={<ShopkeeperManager><ShopOnboardingPage /></ShopkeeperManager>} />
            <Route path="/shop/dashboard" element={<ShopkeeperManager><ShopkeeperDashboard /></ShopkeeperManager>} />
            <Route path="/shop/orders" element={<ShopkeeperManager><OrdersPage /></ShopkeeperManager>} />
            <Route path="/shop/products" element={<ShopkeeperManager><ProductsPage /></ShopkeeperManager>} />

            {/* Trust Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsConditionsPage />} />


            {/* Admin Pages  */}
            <Route path="/admin/categories" element={<CategoriesPage />} />
            <Route path="/admin/area" element={<AreaPage />} />

            {/* 404 Fallback (optional) */}
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </InitialRouteHandler>
      </Router>

      <InitialDataLoader />
      <StateViewer />
    </>
  );
}

export default App;
