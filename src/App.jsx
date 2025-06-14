import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import idID from 'antd/locale/id_ID';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import FAQ from './pages/FAQ';
import Playlist from './pages/Playlist';
import RentalForm from './pages/RentalForm';
import RentalHistory from './pages/RentalHistory';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }
  
  return children;
};

function App() {
  return (
    <ConfigProvider locale={idID}>
      <Router>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/"
                  element={
                    <Layout>
                      <Home />
                    </Layout>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <Layout>
                      <Products />
                    </Layout>
                  }
                />
                <Route
                  path="/faq"
                  element={
                    <Layout>
                      <FAQ />
                    </Layout>
                  }
                />
                <Route
                  path="/playlist"
                  element={
                    <Layout>
                      <Playlist />
                    </Layout>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/rental-form"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <RentalForm />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/rental-history"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <RentalHistory />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;
