// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext'; // IMPORT BARU
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Camping from './pages/Camping';
import Hiking from './pages/Hiking';
import Sale from './pages/Sale';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import AdminOrders from './pages/admin/Orders';
import AdminReports from './pages/admin/Reports';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAdmin } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Admin Layout Component
const AdminLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <>
                  <Header />
                  <main className="main-content">
                    <Home />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/products" element={
                <>
                  <Header />
                  <main className="main-content">
                    <ProductList />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/product/:id" element={
                <>
                  <Header />
                  <main className="main-content">
                    <ProductDetail />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/cart" element={
                <>
                  <Header />
                  <main className="main-content">
                    <Cart />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/checkout" element={
                <>
                  <Header />
                  <main className="main-content">
                    <Checkout />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/wishlist" element={
                <>
                  <Header />
                  <main className="main-content">
                    <Wishlist />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/camping" element={
                <>
                  <Header />
                  <main className="main-content">
                    <Camping />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/hiking" element={
                <>
                  <Header />
                  <main className="main-content">
                    <Hiking />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/sale" element={
                <>
                  <Header />
                  <main className="main-content">
                    <Sale />
                  </main>
                  <Footer />
                </>
              } />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <main className="main-content">
                      <Profile />
                    </main>
                    <Footer />
                  </>
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/admin/products" element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <AdminProducts />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/admin/products/:id" element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <ProductForm />
                  </AdminLayout>
                </ProtectedRoute>
              } />

              <Route path="/admin/products/new" element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <ProductForm />
                  </AdminLayout>
                </ProtectedRoute>
              } />

              <Route path="/admin/products/edit/:id" element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <ProductForm />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/admin/orders" element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <AdminOrders />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/admin/reports" element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <AdminReports />
                  </AdminLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;