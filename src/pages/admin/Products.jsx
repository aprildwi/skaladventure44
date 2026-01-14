// pages/admin/Products.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, 
  FiPackage, FiDollarSign, FiTrendingUp, FiTrendingDown,
  FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import productsData from '../../data/products.json';

function AdminProducts() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    // Load products from localStorage or fallback to default
    const savedProducts = localStorage.getItem('skaladventure_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(productsData);
      localStorage.setItem('skaladventure_products', JSON.stringify(productsData));
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    // Filter products
    let filtered = [...products];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchQuery, selectedCategory]);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleDelete = (productId) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('skaladventure_products', JSON.stringify(updatedProducts));
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleEdit = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleAddNew = () => {
    navigate('/admin/products/new');
  };

  const getStockStatus = (stock) => {
    if (stock > 20) return { color: 'green', text: 'In Stock' };
    if (stock > 5) return { color: 'orange', text: 'Low Stock' };
    return { color: 'red', text: 'Out of Stock' };
  };

  const getSalesTrend = (product) => {
    const sales = Math.floor(Math.random() * 100) + 1;
    const trend = Math.random() > 0.5 ? 'up' : 'down';
    return { sales, trend };
  };

  return (
    <div className="admin-page">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-welcome">
            <h1><FiPackage /> Product Management</h1>
            <p>Manage all products in your inventory</p>
          </div>
          <div className="admin-actions">
            <button onClick={() => navigate('/admin')} className="btn btn-outline">
              <FiChevronLeft /> Back to Dashboard
            </button>
            <button onClick={handleAddNew} className="btn btn-primary">
              <FiPlus /> Add New Product
            </button>
            <button onClick={() => navigate('/admin/products/new')} className="btn btn-primary">
            <FiPlus /> Add New Product
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
              <h3>{products.length}</h3>
              <p>Total Products</p>
            </div>
          </div>
          
          <div className="stat-card admin">
            <div className="stat-icon">
              <FiDollarSign />
            </div>
            <div className="stat-content">
              <h3>{products.filter(p => p.sale).length}</h3>
              <p>Products on Sale</p>
            </div>
          </div>
          
          <div className="stat-card admin">
            <div className="stat-icon">
              <FiTrendingUp />
            </div>
            <div className="stat-content">
              <h3>
                {products.reduce((acc, p) => acc + p.price, 0).toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                })}
              </h3>
              <p>Total Inventory Value</p>
            </div>
          </div>
          
          <div className="stat-card admin">
            <div className="stat-icon">
              <FiTrendingDown />
            </div>
            <div className="stat-content">
              <h3>{products.filter(p => p.stock < 10).length}</h3>
              <p>Low Stock Items</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="admin-controls">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-box">
            <FiFilter />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== 'all').map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="admin-section">
          <div className="section-header">
            <h2>Products ({filteredProducts.length})</h2>
            <div className="table-actions">
              <span>Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length}</span>
            </div>
          </div>
          
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Sales</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map(product => {
                  const stockStatus = getStockStatus(product.stock);
                  const salesTrend = getSalesTrend(product);
                  
                  return (
                    <tr key={product.id}>
                      <td>#{product.id}</td>
                      <td>
                        <div className="product-cell">
                          <img src={product.image} alt={product.name} className="product-thumb" />
                          <div>
                            <div className="product-name">{product.name}</div>
                            <div className="product-brand">{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">{product.category}</span>
                      </td>
                      <td>
                        <div className="price-cell">
                          <div className="current-price">Rp {product.price.toLocaleString()}</div>
                          {product.originalPrice && (
                            <div className="original-price">Rp {product.originalPrice.toLocaleString()}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className={`stock-badge ${stockStatus.color}`}>
                          {product.stock} units
                        </div>
                      </td>
                      <td>
                        <div className="sales-cell">
                          <span>{salesTrend.sales}</span>
                          {salesTrend.trend === 'up' ? (
                            <FiTrendingUp className="trend-up" />
                          ) : (
                            <FiTrendingDown className="trend-down" />
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="status-cell">
                          {product.sale && <span className="sale-badge">SALE</span>}
                          <span className={`stock-status ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => navigate(`/admin/products/edit/${product.id}`)} // PERBAIKI INI
                            className="btn-edit"
                            title="Edit"
                            >
                            <FiEdit2 />
                            </button>
                            <button 
                            onClick={() => confirmDelete(product)}
                            className="btn-delete"
                            title="Delete"
                            >
                            <FiTrash2 />
                            </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && productToDelete && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Confirm Delete</h3>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this product?</p>
                <div className="product-to-delete">
                  <img src={productToDelete.image} alt={productToDelete.name} />
                  <div>
                    <h4>{productToDelete.name}</h4>
                    <p>ID: #{productToDelete.id} • Category: {productToDelete.category}</p>
                  </div>
                </div>
                <p className="warning-text">This action cannot be undone!</p>
              </div>
              <div className="modal-footer">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDelete(productToDelete.id)}
                  className="btn btn-danger"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;