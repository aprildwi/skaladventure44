// pages/admin/Reports.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiBarChart2, FiDollarSign, FiTrendingUp, FiTrendingDown,
  FiCalendar, FiFilter, FiDownload, FiPrinter,
  FiShoppingBag, FiUsers, FiPackage
} from 'react-icons/fi';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function AdminReports() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [timeRange, setTimeRange] = useState('month');
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    // Generate mock data based on time range
    const generateData = () => {
      if (timeRange === 'week') {
        // Weekly data
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map(day => ({
          name: day,
          revenue: Math.floor(Math.random() * 15000000) + 5000000,
          orders: Math.floor(Math.random() * 50) + 20,
          profit: Math.floor(Math.random() * 5000000) + 2000000
        }));
      } else if (timeRange === 'month') {
        // Monthly data (last 30 days)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.map(month => ({
          name: month,
          revenue: Math.floor(Math.random() * 100000000) + 30000000,
          orders: Math.floor(Math.random() * 200) + 100,
          profit: Math.floor(Math.random() * 30000000) + 10000000
        }));
      } else {
        // Yearly data
        return Array.from({ length: 12 }, (_, i) => ({
          name: `Month ${i + 1}`,
          revenue: Math.floor(Math.random() * 500000000) + 200000000,
          orders: Math.floor(Math.random() * 1000) + 500,
          profit: Math.floor(Math.random() * 150000000) + 50000000
        }));
      }
    };

    const generateCategoryData = () => {
      return [
        { name: 'Camping', value: 35, color: '#0d9488' },
        { name: 'Hiking', value: 25, color: '#ea580c' },
        { name: 'Climbing', value: 20, color: '#16a34a' },
        { name: 'Water Sports', value: 15, color: '#2563eb' },
        { name: 'Accessories', value: 5, color: '#7c3aed' }
      ];
    };

    setRevenueData(generateData());
    setCategoryData(generateCategoryData());
    
    // Calculate stats
    const currentData = generateData();
    const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = currentData.reduce((sum, item) => sum + item.orders, 0);
    const totalProfit = currentData.reduce((sum, item) => sum + item.profit, 0);
    const avgOrderValue = totalRevenue / totalOrders;
    
    setStats({
      totalRevenue,
      totalOrders,
      totalProfit,
      avgOrderValue,
      growth: 15.5 // Mock growth percentage
    });
  }, [timeRange, isAdmin, navigate]);

  const COLORS = ['#0d9488', '#ea580c', '#16a34a', '#2563eb', '#7c3aed'];

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportCSV = () => {
    // In a real app, this would generate and download a CSV file
    alert('Exporting report as CSV...');
  };

  return (
    <div className="admin-page">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-welcome">
            <h1><FiBarChart2 /> Financial Reports</h1>
            <p>Track sales performance and revenue analytics</p>
          </div>
          <div className="admin-actions">
            <button onClick={() => navigate('/admin')} className="btn btn-outline">
              Back to Dashboard
            </button>
            <div className="report-actions">
              <button onClick={handleExportCSV} className="btn btn-outline">
                <FiDownload /> Export CSV
              </button>
              <button onClick={handlePrintReport} className="btn btn-primary">
                <FiPrinter /> Print Report
              </button>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="time-range-selector">
          <div className="selector-header">
            <FiCalendar />
            <span>Time Range:</span>
          </div>
          <div className="range-buttons">
            <button 
              className={`range-btn ${timeRange === 'week' ? 'active' : ''}`}
              onClick={() => setTimeRange('week')}
            >
              Weekly
            </button>
            <button 
              className={`range-btn ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              Monthly
            </button>
            <button 
              className={`range-btn ${timeRange === 'year' ? 'active' : ''}`}
              onClick={() => setTimeRange('year')}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="admin-stats">
          <div className="stat-card admin">
            <div className="stat-icon revenue">
              <FiDollarSign />
            </div>
            <div className="stat-content">
              <h3>
                {stats.totalRevenue?.toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                })}
              </h3>
              <p>Total Revenue</p>
              <div className="stat-trend positive">
                <FiTrendingUp /> +{stats.growth}%
              </div>
            </div>
          </div>
          
          <div className="stat-card admin">
            <div className="stat-icon orders">
              <FiShoppingBag />
            </div>
            <div className="stat-content">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
              <div className="stat-trend positive">
                <FiTrendingUp /> +8.2%
              </div>
            </div>
          </div>
          
          <div className="stat-card admin">
            <div className="stat-icon profit">
              <FiTrendingUp />
            </div>
            <div className="stat-content">
              <h3>
                {stats.totalProfit?.toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                })}
              </h3>
              <p>Total Profit</p>
              <div className="stat-trend positive">
                <FiTrendingUp /> +12.4%
              </div>
            </div>
          </div>
          
          <div className="stat-card admin">
            <div className="stat-icon avg">
              <FiUsers />
            </div>
            <div className="stat-content">
              <h3>
                {stats.avgOrderValue?.toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                })}
              </h3>
              <p>Avg. Order Value</p>
              <div className="stat-trend negative">
                <FiTrendingDown /> -2.1%
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          {/* Revenue Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Revenue Trend</h3>
              <span className="chart-subtitle">Revenue over time</span>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis 
                    stroke="#6b7280"
                    tickFormatter={(value) => 
                      `Rp${(value / 1000000).toFixed(0)}M`
                    }
                  />
                  <Tooltip 
                    formatter={(value) => [
                      `Rp ${value.toLocaleString()}`,
                      'Revenue'
                    ]}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#0d9488" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Revenue"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#16a34a" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Orders Overview</h3>
              <span className="chart-subtitle">Number of orders over time</span>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="orders" 
                    fill="#ea580c" 
                    name="Orders"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Category Distribution</h3>
              <span className="chart-subtitle">Sales by product category</span>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Share']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products Table */}
          <div className="chart-card full-width">
            <div className="chart-header">
              <h3>Top Performing Products</h3>
              <span className="chart-subtitle">Best selling products by revenue</span>
            </div>
            <div className="top-products-table">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Units Sold</th>
                    <th>Revenue</th>
                    <th>Profit Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Cloud River™ Tent', category: 'Camping', sold: 156, revenue: 184000000, margin: '45%' },
                    { name: 'Alamere Sleeping Bag', category: 'Camping', sold: 128, revenue: 326000000, margin: '52%' },
                    { name: 'Aircontact Backpack', category: 'Hiking', sold: 89, revenue: 389000000, margin: '48%' },
                    { name: "Women's Thermo Boots", category: 'Hiking', sold: 142, revenue: 300000000, margin: '50%' },
                    { name: 'Astro 300 Headlamp', category: 'Camping', sold: 203, revenue: 85000000, margin: '55%' }
                  ].map((product, index) => (
                    <tr key={index}>
                      <td>
                        <div className="product-cell">
                          <div className="product-name">{product.name}</div>
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">{product.category}</span>
                      </td>
                      <td>{product.sold}</td>
                      <td>Rp {product.revenue.toLocaleString()}</td>
                      <td>
                        <span className={`margin-badge ${product.margin > '50%' ? 'high' : 'medium'}`}>
                          {product.margin}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary Report */}
        <div className="summary-report">
          <h3>Financial Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <h4>Gross Revenue</h4>
              <p className="summary-value">
                {stats.totalRevenue?.toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                })}
              </p>
            </div>
            <div className="summary-item">
              <h4>Operating Costs</h4>
              <p className="summary-value">
                Rp {(stats.totalRevenue - stats.totalProfit).toLocaleString()}
              </p>
            </div>
            <div className="summary-item">
              <h4>Net Profit</h4>
              <p className="summary-value profit">
                {stats.totalProfit?.toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                })}
              </p>
            </div>
            <div className="summary-item">
              <h4>Profit Margin</h4>
              <p className="summary-value">
                {((stats.totalProfit / stats.totalRevenue) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminReports;