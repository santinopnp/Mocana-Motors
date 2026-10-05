import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header       from './components/Header';
import Footer       from './components/Footer';
import BottomNav    from './components/BottomNav';
import ChatWidget   from './components/ChatWidget';
import LandingPage  from './pages/LandingPage';
import ShopPage     from './pages/ShopPage';
import ProductPage  from './pages/ProductPage';
import CartPage     from './pages/CartPage';
import ServicePage  from './pages/ServicePage';
import LoginPage    from './pages/LoginPage';
import AccountPage  from './pages/AccountPage';
import AdminDashboard from './pages/admin/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            {/* pb-16 on mobile reserves space for the bottom nav */}
            <div className="flex-1 pb-16 md:pb-0">
              <Routes>
                <Route path="/"          element={<LandingPage />} />
                <Route path="/shop"      element={<ShopPage />} />
                <Route path="/product/:slug" element={<ProductPage />} />
                <Route path="/cart"      element={<CartPage />} />
                <Route path="/service"   element={<ServicePage />} />
                <Route path="/login"     element={<LoginPage />} />
                <Route path="/account"   element={<AccountPage />} />
                <Route path="/admin"     element={<AdminDashboard />} />
              </Routes>
            </div>
            <Footer />
            <BottomNav />
            <ChatWidget />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
