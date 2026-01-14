// pages/Sale.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { FiClock, FiPercent, FiTrendingDown } from 'react-icons/fi';
import productsData from '../data/products.json';

function Sale() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('discount-high');
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  const navigate = useNavigate();

  // Filter hanya produk yang sale: true
  const saleProducts = productsData.filter(product => product.sale === true);

  useEffect(() => {
    setProducts(saleProducts);
    applyFilters(saleProducts, selectedCategory);
    
    // Timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newSeconds = prev.seconds - 1;
        if (newSeconds < 0) {
          const newMinutes = prev.minutes - 1;
          if (newMinutes < 0) {
            const newHours = prev.hours - 1;
            if (newHours < 0) {
              const newDays = prev.days - 1;
              if (newDays < 0) {
                clearInterval(timer);
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
              }
              return { days: newDays, hours: 23, minutes: 59, seconds: 59 };
            }
            return { ...prev, hours: newHours, minutes: 59, seconds: 59 };
          }
          return { ...prev, minutes: newMinutes, seconds: 59 };
        }
        return { ...prev, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const categories = ['all', ...new Set(saleProducts.map(p => p.category))];

  const applyFilters = (productList, category = 'all') => {
    let filtered = productList;
    
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    
    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    applyFilters(products, category);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    
    let sorted = [...filteredProducts];
    
    switch(value) {
      case 'discount-high':
        sorted.sort((a, b) => (b.salePercentage || 0) - (a.salePercentage || 0));
        break;
      case 'discount-low':
        sorted.sort((a, b) => (a.salePercentage || 0) - (b.salePercentage || 0));
        break;
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        sorted = [...filteredProducts];
    }
    
    setFilteredProducts(sorted);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSortBy('discount-high');
  };

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  return (
    <div className="sale-page">
      <div className="container">
        {/* Sale Banner */}
        <div className="sale-banner">
          <div className="sale-header">
            <div className="sale-tag">
              <FiTrendingDown />
              <span>LIMITED TIME SALE</span>
            </div>
            <h1>Hot Deals & Discounts</h1>
            <p className="sale-subtitle">
              Up to 30% off on premium outdoor gear
            </p>
          </div>
          
          {/* Sale Stats */}
          <div className="sale-stats">
            <div className="sale-stat">
              <span className="stat-value">{saleProducts.length}</span>
              <span className="stat-label">Items on Sale</span>
            </div>
            <div className="sale-stat">
              <span className="stat-value">30%</span>
              <span className="stat-label">Max Discount</span>
            </div>
            <div className="sale-stat">
              <span className="stat-value">🔥</span>
              <span className="stat-label">Hot Deals</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="sale-controls">
          <div className="sale-categories">
            <h3>Shop by Category:</h3>
            <div className="category-tags">
              {categories.map(category => (
                <button
                  key={category}
                  className={`sale-category-tag ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category === 'all' ? 'All Sale Items' : category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="sale-sort">
            <select 
              value={sortBy} 
              onChange={handleSortChange}
              className="sale-sort-select"
            >
              <option value="discount-high">Highest Discount</option>
              <option value="discount-low">Lowest Discount</option>
              <option value="price-low">Lowest Price</option>
              <option value="price-high">Highest Price</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="sale-products-section">
          {filteredProducts.length > 0 ? (
            <>
              <div className="sale-products-header">
                <h2>
                  {selectedCategory === 'all' ? 'All Sale Items' : `${selectedCategory} on Sale`}
                  <span className="sale-count"> ({filteredProducts.length} items)</span>
                </h2>
                <p className="sale-savings">
                  Save up to {Math.max(...filteredProducts.map(p => p.salePercentage || 0))}% on selected items
                </p>
              </div>
              
              <div className="product-grid">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="no-products">
              <h3>No sale items found in this category</h3>
              <p>Check out other categories for amazing deals!</p>
              <button onClick={() => setSelectedCategory('all')} className="btn btn-primary">
                View All Sale Items
              </button>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="sale-cta">
          <div className="sale-cta-content">
            <h2>Extended Sale! 🎉</h2>
            <p>Free shipping on all sale items over Rp 500,000</p>
            <div className="sale-cta-buttons">
              <button onClick={() => navigate('/products')} className="btn btn-primary">
                Shop All Products
              </button>
              <button onClick={clearFilters} className="btn btn-outline">
                View All Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sale;