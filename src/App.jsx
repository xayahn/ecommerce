/**
 * App.jsx
 * Root router — maps all URLs to pages.
 * Protected routes use <ProtectedRoute> wrapper.
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense }          from "react";
import Layout                      from "./components/Layout";
import ProtectedRoute              from "./components/ProtectedRoute";
import Spinner                     from "./components/Spinner";

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
const HomePage            = lazy(() => import("./pages/HomePage"));
const ShopPage            = lazy(() => import("./pages/ShopPage"));
const ProductDetailPage   = lazy(() => import("./pages/ProductDetailPage"));
const CartPage            = lazy(() => import("./pages/CartPage"));
const CheckoutPage        = lazy(() => import("./pages/CheckoutPage"));
const OrderConfirmPage    = lazy(() => import("./pages/OrderConfirmPage"));
const OrdersPage          = lazy(() => import("./pages/OrdersPage"));
const WishlistPage        = lazy(() => import("./pages/WishlistPage"));
const LoginPage           = lazy(() => import("./pages/LoginPage"));
const RegisterPage        = lazy(() => import("./pages/RegisterPage"));
const NotFoundPage        = lazy(() => import("./pages/NotFoundPage"));

// ─── Fallback ─────────────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

const App = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes — with Layout */}
        <Route element={<Layout><Suspense fallback={<PageLoader />}><HomePage /></Suspense></Layout>}          path="/" />
        <Route element={<Layout><Suspense fallback={<PageLoader />}><ShopPage /></Suspense></Layout>}          path="/shop" />
        <Route element={<Layout><Suspense fallback={<PageLoader />}><ProductDetailPage /></Suspense></Layout>} path="/products/:handle" />
        <Route element={<Layout><Suspense fallback={<PageLoader />}><CartPage /></Suspense></Layout>}          path="/cart" />
        <Route element={<Layout><Suspense fallback={<PageLoader />}><WishlistPage /></Suspense></Layout>}      path="/wishlist" />

        {/* Protected routes */}
        <Route
          path="/checkout"
          element={
            <Layout>
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <CheckoutPage />
                </Suspense>
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/order-confirmation/:id"
          element={
            <Layout>
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <OrderConfirmPage />
                </Suspense>
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/orders"
          element={
            <Layout>
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <OrdersPage />
                </Suspense>
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* Auth routes — no Layout */}
        <Route path="/login"    element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>}    />
        <Route path="/register" element={<Suspense fallback={<PageLoader />}><RegisterPage /></Suspense>} />

        {/* Fallback */}
        <Route path="/404"      element={<Layout><Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense></Layout>} />
        <Route path="*"         element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;