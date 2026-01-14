// pages/Camping.jsx - Hanya produk camping
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { FiFilter, FiX, FiCompass } from 'react-icons/fi';
import { GiCampingTent, GiForestCamp } from 'react-icons/gi';
import productsData from '../data/products.json';

function Camping() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  // Filter hanya produk camping
  const campingProducts = productsData.filter(p => p.category === 'Camping');

  // Subcategories camping
  const subcategories = [
    'all',
    ...new Set(campingProducts.map(p => p.subcategory).filter(Boolean))
  ];

  useEffect(() => {
    setProducts(campingProducts);
    applyFilters(campingProducts, searchQuery, selectedSubcategory);
  }, [searchQuery]);

  const applyFilters = (productList, query = '', subcategory = 'all') => {
    let filtered = productList;
    
    // Apply subcategory filter
    if (subcategory !== 'all') {
      filtered = filtered.filter(p => p.subcategory === subcategory);
    }
    
    // Apply search filter
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.subcategory?.toLowerCase().includes(lowerQuery) ||
        p.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        // Smart search untuk camping
        (lowerQuery === 'sleeping' && p.subcategory === 'Sleeping') ||
        (lowerQuery === 'tent' && p.subcategory === 'Tent') ||
        (lowerQuery === 'light' && p.subcategory === 'Lighting')
      );
    }
    
    setFilteredProducts(filtered);
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory);
    applyFilters(products, searchQuery, subcategory);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    
    let sorted = [...filteredProducts];
    
    switch(value) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'sale':
        sorted.sort((a, b) => (b.sale ? 1 : 0) - (a.sale ? 1 : 0));
        break;
      default:
        sorted = [...filteredProducts];
    }
    
    setFilteredProducts(sorted);
  };

  const clearFilters = () => {
    setSelectedSubcategory('all');
    setSortBy('default');
    setShowFilters(false);
    navigate('/camping');
  };

  return (
    <div className="camping-page">
      <div className="container">
        {/* Hero Section */}
        <div className="category-hero">
          <div className="hero-content">
            <h1><GiCampingTent /> Camping Gear</h1>
            <p className="hero-description">
              Premium camping equipment including tents, sleeping bags, lighting, and cooking gear
            </p>
          </div>
        </div>

        {/* Category Stats */}
        <div className="category-stats">
          <div className="stat">
            <span className="stat-number">{campingProducts.length}</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {campingProducts.filter(p => p.sale).length}
            </span>
            <span className="stat-label">On Sale</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {new Set(campingProducts.map(p => p.subcategory)).size}
            </span>
            <span className="stat-label">Categories</span>
          </div>
        </div>

        {/* Controls */}
        <div className="category-controls">
          <div className="controls-left">
            <h2>Camping Equipment ({filteredProducts.length})</h2>
          </div>
          <div className="controls-right">
            <select 
              value={sortBy} 
              onChange={handleSortChange}
              className="sort-select"
            >
              <option value="default">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
              <option value="sale">On Sale First</option>
            </select>
            
            <button 
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter /> Filters
            </button>
          </div>
        </div>

        {/* Subcategories */}
        <div className="subcategories">
          <h3>Shop by Type:</h3>
          <div className="subcategory-tags">
            {subcategories.map(subcat => (
              <button
                key={subcat}
                className={`subcategory-tag ${selectedSubcategory === subcat ? 'active' : ''}`}
                onClick={() => handleSubcategoryChange(subcat)}
              >
                {subcat === 'all' ? 'All Camping Gear' : subcat}
                {subcat !== 'all' && (
                  <span className="tag-count">
                    ({campingProducts.filter(p => p.subcategory === subcat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-section">
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <h3>No camping gear found</h3>
              <p>Try adjusting your filters</p>
              <button onClick={clearFilters} className="btn btn-primary">
                Show All Camping Gear
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Camping;