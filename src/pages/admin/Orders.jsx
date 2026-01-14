// pages/admin/Orders.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiPackage, FiTruck, FiCheckCircle, FiClock, 
  FiDollarSign, FiFilter, FiSearch, FiEye,
  FiChevronLeft, FiChevronRight, FiX
} from 'react-icons/fi';

function AdminOrders() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock orders data
  const mockOrders = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      email: 'john@example.com',
      date: '2024-01-15',
      items: 3,
      total: 4250000,
      status: 'completed',
      payment: 'Credit Card',
      shipping: 'JNE Express'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      date: '2024-01-14',
      items: 2,
      total: 1850000,
      status: 'processing',
      payment: 'Bank Transfer',
      shipping: 'JNE Express'
    },
    {
      id: 'ORD-003',
      customer: 'Bob Wilson',
      email: 'bob@example.com',
      date: '2024-01-13',
      items: 1,
      total: 850000,
      status: 'pending',
      payment: 'Credit Card',
      shipping: 'JNE Express'
    },
    // Add more mock orders...
  ];

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    // Load orders from localStorage or use mock data
    const savedOrders = localStorage.getItem('skaladventure_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders(mockOrders);
      localStorage.setItem('skaladventure_orders', JSON.stringify(mockOrders));
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    let filtered = [...orders];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [orders, searchQuery, statusFilter]);

  const statusOptions = [
    { value: 'all', label: 'All Status', icon: <FiPackage /> },
    { value: 'pending', label: 'Pending', icon: <FiClock />, color: 'orange' },
    { value: 'processing', label: 'Processing', icon: <FiTruck />, color: 'blue' },
    { value: 'completed', label: 'Completed', icon: <FiCheckCircle />, color: 'green' },
    { value: 'cancelled', label: 'Cancelled', icon: <FiX />, color: 'red' }
  ];

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('skaladventure_orders', JSON.stringify(updatedOrders));
  };

  const getStatusBadge = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return (
      <span className={`status-badge ${option?.color || 'gray'}`}>
        {option?.icon}
        {option?.label}
      </span>
    );
  };

  const calculateRevenue = () => {
    return orders
      .filter(order => order.status === 'completed')
      .reduce((total, order) => total + order.total, 0);
  };

  return (
    <div className="admin-page">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-welcome">
            <h1><FiPackage /> Order Management</h1>
            <p>Manage customer orders and track shipments</p>
          </div>
          <div className="admin-actions">
            <button onClick={() => navigate('/admin')} className="btn btn-outline">
              <FiChevronLeft /> Back to Dashboard
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="admin-stats">
          <div className="stat-card admin">
            <div className="stat-icon">
              <FiPackage />
            </div>
            <div className="stat-content">
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          
          <div className="stat-card admin">
            <div className="stat-icon">
              <FiDollarSign />
            </div>
            <div className="stat-content">
              <h3>
                {calculateRevenue().toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                })}
              </h3>
              <p>Total Revenue</p>
            </div>
          </div>
          
          <div className="stat-card admin">
            <div className="stat-icon">
              <FiTruck />
            </div>
            <div className="stat-content">
              <h3>{orders.filter(o => o.status === 'processing').length}</h3>
              <p>In Progress</p>
            </div>
          </div>
          
          <div className="stat-card admin">
            <div className="stat-icon">
              <FiCheckCircle />
            </div>
            <div className="stat-content">
              <h3>{orders.filter(o => o.status === 'completed').length}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="admin-controls">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search orders by ID, customer, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-box">
            <FiFilter />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="admin-section">
          <div className="section-header">
            <h2>Orders ({filteredOrders.length})</h2>
            <div className="table-actions">
              <span>Showing {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length}</span>
            </div>
          </div>
          
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map(order => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-name">{order.customer}</div>
                        <div className="customer-email">{order.email}</div>
                      </div>
                    </td>
                    <td>{order.date}</td>
                    <td>{order.items} items</td>
                    <td>
                      <div className="price-cell">
                        Rp {order.total.toLocaleString()}
                      </div>
                    </td>
                    <td>
                      {getStatusBadge(order.status)}
                    </td>
                    <td>
                      <span className="payment-method">{order.payment}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-view"
                          title="View Details"
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                        >
                          <FiEye />
                        </button>
                        
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <FiChevronLeft /> Previous
              </button>
              
              <div className="page-numbers">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next <FiChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;