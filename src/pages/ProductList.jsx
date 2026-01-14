// pages/ProductList.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { FiFilter, FiX } from 'react-icons/fi';
import productsData from '../data/products.json';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    // Semua produk dari data
    setProducts(productsData);
    applySearchAndFilters(productsData, searchQuery, selectedCategory);
  }, [searchQuery]);

  const categories = ['all', ...new Set(productsData.map(p => p.category))];

  // Fungsi search yang lebih cerdas
  const applySearchAndFilters = (productList, query = '', category = 'all') => {
    let filtered = productList;
    
    // Apply category filter
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    
    // Apply search filter dengan pencarian cerdas
    if (query) {
      const lowerQuery = query.toLowerCase().trim();
      
      filtered = filtered.filter(p => {
        // Cari di semua field yang relevan
        const searchInFields = [
          p.name.toLowerCase(),
          p.description.toLowerCase(),
          p.category.toLowerCase(),
          p.subcategory?.toLowerCase() || '',
          p.brand.toLowerCase(),
          p.tags?.join(' ').toLowerCase() || ''
        ].join(' ');
        
        // Cek apakah query ada di salah satu field
        return searchInFields.includes(lowerQuery) ||
               // Pencarian sinonim untuk "shoes"
               (lowerQuery === 'shoes' && (
                 p.subcategory === 'Footwear' ||
                 p.tags?.some(tag => ['shoes', 'boots', 'footwear'].includes(tag.toLowerCase()))
               )) ||
               // Pencarian sinonim untuk "tent"
               (lowerQuery === 'tent' && (
                 p.subcategory === 'Tent' ||
                 p.tags?.some(tag => tag.toLowerCase().includes('tent'))
               )) ||
               // Pencarian sinonim untuk "backpack"
               (lowerQuery === 'backpack' && (
                 p.subcategory === 'Backpack' ||
                 p.tags?.some(tag => tag.toLowerCase().includes('backpack') || tag.toLowerCase().includes('pack'))
               )) ||
               // Pencarian sinonim untuk "sleeping"
               (lowerQuery === 'sleeping' && (
                 p.subcategory === 'Sleeping' ||
                 p.tags?.some(tag => tag.toLowerCase().includes('sleep'))
               ));
      });
    }
    
    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    applySearchAndFilters(products, searchQuery, category);
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
    setSelectedCategory('all');
    setSortBy('default');
    setShowFilters(false);
    navigate('/products');
  };

  const displaySearchQuery = searchQuery ? ` for "${searchQuery}"` : '';

  return (
    <div className="product-list-page">
      <div className="container">
        <h1>Outdoor Gear{displaySearchQuery}</h1>
        
        <div className="product-list-controls">
          <div className="controls-right">
            <select 
              value={sortBy} 
              onChange={handleSortChange}
              className="sort-select"
            >
              <option value="default">Sort by: Default</option>
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

        <div className="product-list-content">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="filters-sidebar">
              <div className="filter-header">
                <h3>Filters</h3>
                <button 
                  className="filter-close"
                  onClick={() => setShowFilters(false)}
                >
                  <FiX />
                </button>
              </div>
              
              <div className="filter-section">
                <h4>Categories</h4>
                {categories.map(category => (
                  <button
                    key={category}
                    className={`filter-category ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </button>
                ))}
              </div>
              
              <div className="filter-actions">
                <button onClick={clearFilters} className="btn btn-outline">
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="products-container">
            <div className="products-count">
              Showing {filteredProducts.length} of {products.length} products
              {searchQuery && ` for "${searchQuery}"`}
            </div>
            
            {filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your search or filters</p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;