import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { CartPage } from "./module/customer/cart/page";
import { CheckoutPage } from "./module/customer/checkout/page";
import { ProductCatalog } from "./module/customer/productCatalog/page";
import { ShopAccessPage } from "./module/customer/shopAccess/page";
import { LandingPage } from "./module/landing/page";
import { ShopkeeperDashboard } from "./module/shopkeeper/dashboard/page";
import { OrdersPage } from "./module/shopkeeper/order/page";
import { ProductsPage } from "./module/shopkeeper/product/page";
import { ShopOnboardingPage } from "./module/shopkeeper/onboarding/page";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Landing */}
          <Route path="/" element={<LandingPage />} />

          {/* Customer Routes */}
          <Route path="/customer/shop-access" element={<ShopAccessPage />} />
          <Route path="/customer/products" element={<ProductCatalog />} />
          <Route path="/customer/cart" element={<CartPage />} />
          <Route path="/customer/checkout" element={<CheckoutPage />} />

          {/* Shopkeeper Routes */}
          <Route path="/shop/onboarding" element={<ShopOnboardingPage />} />
          <Route path="/shop/dashboard" element={<ShopkeeperDashboard />} />
          <Route path="/shop/orders" element={<OrdersPage />} />
          <Route path="/shop/products" element={<ProductsPage />} />

          {/* 404 Fallback (optional) */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
