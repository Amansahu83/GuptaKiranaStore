import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrderPage from './pages/OrderPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminProductListPage from './pages/admin/ProductListPage';
import AdminProductEditPage from './pages/admin/ProductEditPage';
import AdminOrderListPage from './pages/admin/OrderListPage';
import { UserContext } from './context/UserContext';
import { CartContext } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  
  useEffect(() => {
    // Check for user in localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    
    // Check for cart in localStorage
    const cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
      setCart(JSON.parse(cartItems));
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }, [cart]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <CartContext.Provider value={{ cart, setCart }}>
        <div className="App">
          <Header />
          <main className="container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/order/:id" element={
                <ProtectedRoute>
                  <OrderPage />
                </ProtectedRoute>
              } />
              <Route path="/order-history" element={
                <ProtectedRoute>
                  <OrderHistoryPage />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/products" element={
                <AdminRoute>
                  <AdminProductListPage />
                </AdminRoute>
              } />
              <Route path="/admin/product/:id/edit" element={
                <AdminRoute>
                  <AdminProductEditPage />
                </AdminRoute>
              } />
              <Route path="/admin/orders" element={
                <AdminRoute>
                  <AdminOrderListPage />
                </AdminRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartContext.Provider>
    </UserContext.Provider>
  );
}

export default App;