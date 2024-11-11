import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';
import AdminPanel from './pages/Adminpanel';
import RestaurantPending from './pages/RestaurantPending';
import ProtectedRoute from './components/ProtectedRoute';
import Restaurants from './pages/Restaurants';
import About from'./components/About';

import Partners from'./components/Partners';
import Careers from'./components/Careers';
import Terms from './components/Terms';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import ScrollToTop from './components/ScrollToTop';
import LateNightDelivery from './pages/LateNightDelivery';
import RestaurantDashboard from './pages/RestaurantDashboard';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
        <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-tracking" element={<OrderTracking />} />
                  <Route path="/restaurant-pending" element={<RestaurantPending />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/restaurants" element={<Restaurants />} />
                  <Route path="/restaurant-dashboard" element={<ProtectedRoute restaurantOnly><RestaurantDashboard /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
                  <Route path="/restaurants/:restaurantId" element={<Menu />} />
                  <Route path="/late-night" element={<LateNightDelivery />} />
                </Routes>
              </AnimatePresence>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;