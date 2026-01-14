// pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FiShoppingBag, 
  FiUsers, 
  FiDollarSign, 
  FiTrendingUp,
  FiPackage,
  FiBarChart2,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import productsData from '../../data/products.json';

function AdminDashboard() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    // Calculate stats
    const totalProducts = productsData.length;
    const totalOrders = 125;
    const totalRevenue = 45000000;
    const totalUsers = 89;

    setStats({
      totalProducts,
      totalOrders,
      totalRevenue,
      totalUsers
    });

    // Mock recent orders
    const orders = [
      { id: '#ORD001', customer: 'John Doe', amount: 'Rp 2,500,000', status: 'Completed' },
      { id: '#ORD002', customer: 'Jane Smith', amount: 'Rp 1,850,000', status: 'Processing' },
      { id: '#ORD003', customer: 'Bob Wilson', amount: 'Rp 3,200,000', status: 'Pending' },
      { id: '#ORD004', customer: 'Alice Brown', amount: 'Rp 950,000', status: 'Completed' },
      { id: '#ORD005', customer: 'Charlie Davis', amount: 'Rp 4,100,000', status: 'Processing' },
    ];

    // Mock top products
    const top = productsData.slice(0, 5).map(p => ({
      ...p,
      sales: Math.floor(Math.random() * 100) + 50
    }));

    setRecentOrders(orders);
    setTopProducts(top.sort((a, b) => b.sales - a.sales).slice(0, 5));
  }, [isAdmin, navigate]);

  if (!isAdmin || !user) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        {/* Admin Header */}
        <div className="admin-header">
          <div className="admin-welcome">
            <h1><FiSettings /> Admin Dashboard</h1>
            <p>Welcome back, {user.name}! 👑</p>
          </div>
          <div className="admin-actions">
            <button onClick={logout} className="btn btn-secondary">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="admin-stats">
          <div className="stat-card admin">
            <div className="stat-icon">
              <FiShoppingBag />
            </div>
            <div className="stat-content">
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
            <div className="stat-trend">
              <FiTrendingUp /> +12%
            </div>
          </div>

          <div className="stat-card admin">
            <div className="stat-icon">
              <FiUsers />
            </div>
            <div className="stat-content">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
            <div className="stat-trend">
              <FiTrendingUp /> +8%
            </div>
          </div>

          <div className="stat-card admin">
            <div className="stat-icon">
              <FiDollarSign />
            </div>
            <div className="stat-content">
              <h3>Rp {stats.totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
            <div className="stat-trend">
              <FiTrendingUp /> +15%
            </div>
          </div>

          <div className="stat-card admin">
            <div className="stat-icon">
              <FiPackage />
            </div>
            <div className="stat-content">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
            <div className="stat-trend">
              <FiTrendingUp /> +10%
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="admin-content">
          {/* Recent Orders */}
          <div className="admin-section">
            <div className="section-header">
              <h2><FiShoppingBag /> Recent Orders</h2>
              <button 
                onClick={() => navigate('/admin/orders')}
                className="btn btn-outline"
              >
                View All
              </button>
            </div>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.amount}</td>
                      <td>
                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn-small">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products */}
          <div className="admin-section">
            <div className="section-header">
              <h2><FiBarChart2 /> Top Products</h2>
              <button 
                onClick={() => navigate('/admin/products')}
                className="btn btn-outline"
              >
                Manage Products
              </button>
            </div>
            <div className="top-products">
              {topProducts.map(product => (
                <div key={product.id} className="top-product-card">
                  <img src={product.image} alt={product.name} />
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="product-category">{product.category}</p>
                    <div className="product-stats">
                      <span>Sales: {product.sales}</span>
                      <span>Rp {product.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button 
              onClick={() => navigate('/admin/products/new')}
              className="btn btn-primary"
            >
              + Add New Product
            </button>
            <button 
              onClick={() => navigate('/admin/users')}
              className="btn btn-outline"
            >
              Manage Users
            </button>
            <button 
              onClick={() => navigate('/admin/analytics')}
              className="btn btn-outline"
            >
              View Analytics
            </button>
            <button 
              onClick={() => navigate('/admin/settings')}
              className="btn btn-outline"
            >
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;