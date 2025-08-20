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
      <Router>
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

          {/* 404 Fallback (optional) */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
