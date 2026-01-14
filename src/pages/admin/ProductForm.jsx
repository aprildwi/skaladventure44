// pages/admin/ProductForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiSave, FiX, FiUpload, FiImage, 
  FiDollarSign, FiPackage, FiTag,
  FiEdit2, FiPlus, FiTrash2,
  FiPercent, FiHash, FiBox
} from 'react-icons/fi';

function ProductForm() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const isEditMode = id && id !== 'new';
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    originalPrice: '',
    image: '',
    description: '',
    category: 'Camping',
    subcategory: '',
    stock: '10',
    brand: '',
    weight: '',
    sale: false,
    salePercentage: 0,
    tags: [],
    specifications: []
  });
  
  const [specInput, setSpecInput] = useState({ key: '', value: '' });
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');

  const categories = ['Camping', 'Hiking', 'Climbing', 'Water Sports', 'Accessories'];
  
  const subcategories = {
    'Camping': ['Tent', 'Sleeping Bag', 'Lighting', 'Cooking', 'Furniture', 'Tools'],
    'Hiking': ['Backpack', 'Footwear', 'Clothing', 'Navigation', 'Safety'],
    'Climbing': ['Ropes', 'Harnesses', 'Carabiners', 'Helmets', 'Shoes'],
    'Water Sports': ['Dry Bag', 'Life Jacket', 'Paddles', 'Kayaks', 'Snorkeling'],
    'Accessories': ['Headlamp', 'Water Bottle', 'Multitool', 'Compass', 'First Aid']
  };

  const popularTags = ['waterproof', 'lightweight', 'compact', 'premium', 'outdoor', 'durable', 'portable'];

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    if (isEditMode) {
      // Load product data for editing
      loadProductData();
    } else {
      // Generate new ID for new product
      generateNewId();
    }
  }, [id, isAdmin, navigate, isEditMode]);

  const loadProductData = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const savedProducts = JSON.parse(localStorage.getItem('skaladventure_products') || '[]');
      const product = savedProducts.find(p => p.id === parseInt(id));
      
      if (product) {
        const productData = {
          ...product,
          originalPrice: product.originalPrice || '',
          subcategory: product.subcategory || '',
          brand: product.brand || '',
          weight: product.weight || '',
          salePercentage: product.salePercentage || 0,
          tags: product.tags || [],
          specifications: product.specifications || [
            { key: 'Material', value: 'Nylon' },
            { key: 'Waterproof', value: 'Yes' },
            { key: 'Weight', value: product.weight || 'N/A' }
          ]
        };
        
        setFormData(productData);
        setImagePreview(product.image);
      } else {
        alert('Product not found');
        navigate('/admin/products');
      }
      
      setLoading(false);
    }, 500);
  };

  const generateNewId = () => {
    const savedProducts = JSON.parse(localStorage.getItem('skaladventure_products') || '[]');
    const newId = savedProducts.length > 0 
      ? Math.max(...savedProducts.map(p => p.id)) + 1 
      : 21; // Start from 21 if no products
    
    setFormData(prev => ({
      ...prev,
      id: newId
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else if (!isValidImageUrl(formData.image)) {
      newErrors.image = 'Please enter a valid image URL (jpg, png, webp)';
    }
    if (!formData.description.trim() || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidImageUrl = (url) => {
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(url) || url.startsWith('https://images.unsplash.com');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    
    try {
      const savedProducts = JSON.parse(localStorage.getItem('skaladventure_products') || '[]');
      const productToSave = {
        ...formData,
        id: parseInt(formData.id),
        price: parseInt(formData.price),
        originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : undefined,
        stock: parseInt(formData.stock),
        salePercentage: formData.sale ? parseInt(formData.salePercentage) || 0 : 0,
        sale: formData.sale || false
      };
      
      let updatedProducts;
      
      if (isEditMode) {
        // Update existing product
        updatedProducts = savedProducts.map(p => 
          p.id === parseInt(id) ? productToSave : p
        );
      } else {
        // Add new product
        updatedProducts = [...savedProducts, productToSave];
      }
      
      localStorage.setItem('skaladventure_products', JSON.stringify(updatedProducts));
      
      // Show success message
      alert(`Product ${isEditMode ? 'updated' : 'added'} successfully!`);
      
      // Navigate back to products list
      navigate('/admin/products');
      
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Update image preview
    if (name === 'image') {
      setImagePreview(value);
      if (value && isValidImageUrl(value)) {
        setImageError(false);
      }
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handlePopularTagClick = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleAddSpec = () => {
    if (specInput.key.trim() && specInput.value.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: [...prev.specifications, { 
          key: specInput.key.trim(), 
          value: specInput.value.trim() 
        }]
      }));
      setSpecInput({ key: '', value: '' });
    }
  };

  const handleRemoveSpec = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSpecKeyPress = (e, field) => {
    if (e.key === 'Enter' && field === 'value') {
      e.preventDefault();
      handleAddSpec();
    }
  };

  const calculateDiscount = () => {
    if (formData.originalPrice && formData.price) {
      const discount = Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100);
      return discount > 0 ? discount : 0;
    }
    return 0;
  };

  const handleAutoFillDiscount = () => {
    const discount = calculateDiscount();
    if (discount > 0) {
      setFormData(prev => ({
        ...prev,
        salePercentage: discount,
        sale: true
      }));
    }
  };

  const handleGenerateDescription = () => {
    const descriptions = {
      'Camping': `Premium ${formData.category.toLowerCase()} gear designed for outdoor adventures. Durable construction with weather-resistant materials. Perfect for backpacking and wilderness expeditions.`,
      'Hiking': `High-performance ${formData.category.toLowerCase()} equipment built for rugged terrain. Lightweight design with ergonomic features for maximum comfort on long trails.`,
      'Climbing': `Professional-grade ${formData.category.toLowerCase()} equipment meeting safety standards. Engineered for reliability in challenging vertical environments.`,
      'Water Sports': `Waterproof ${formData.category.toLowerCase()} gear for aquatic adventures. Corrosion-resistant materials with secure fastening systems.`,
      'Accessories': `Essential ${formData.category.toLowerCase()} for every outdoor enthusiast. Compact and versatile design for multi-purpose use.`
    };
    
    const defaultDesc = `High-quality ${formData.category.toLowerCase()} product from ${formData.brand || 'our premium collection'}. Designed for durability and performance in outdoor conditions.`;
    
    const newDescription = descriptions[formData.category] || defaultDesc;
    
    setFormData(prev => ({
      ...prev,
      description: newDescription
    }));
  };

  if (loading && isEditMode) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading product data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-welcome">
            <h1>
              {isEditMode ? <FiEdit2 /> : <FiPlus />}
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p>
              {isEditMode 
                ? `Editing product #${formData.id} - ${formData.name || 'Untitled'}`
                : 'Create a new product listing for your store'
              }
            </p>
          </div>
          <div className="admin-actions">
            <button 
              onClick={() => navigate('/admin/products')} 
              className="btn btn-outline"
              disabled={loading}
            >
              <FiX /> Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-small"></div> Saving...
                </>
              ) : (
                <>
                  <FiSave /> {isEditMode ? 'Update Product' : 'Save Product'}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="admin-section">
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-grid">
              {/* Left Column - Basic Info */}
              <div className="form-column">
                {/* Product ID (Read-only for edit) */}
                <div className="form-section">
                  <h3><FiHash /> Product Information</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Product ID</label>
                      <input
                        type="text"
                        value={formData.id}
                        readOnly
                        className="read-only"
                      />
                      <small className="form-help">Auto-generated</small>
                    </div>
                    
                    <div className="form-group">
                      <label>Brand</label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="e.g., NatureHike, Merrell"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                    <small className="form-help">Be descriptive and include key features</small>
                  </div>
                  
                  <div className="form-group">
                    <label>Description *</label>
                    <div className="description-controls">
                      <button 
                        type="button" 
                        onClick={handleGenerateDescription}
                        className="btn-help"
                      >
                        Generate Description
                      </button>
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the product features, benefits, and specifications..."
                      rows="5"
                      className={errors.description ? 'error' : ''}
                    />
                    {errors.description && <span className="error-message">{errors.description}</span>}
                    <small className="form-help">
                      Characters: {formData.description.length} (Minimum: 10)
                    </small>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={errors.category ? 'error' : ''}
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      {errors.category && <span className="error-message">{errors.category}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Subcategory</label>
                      <select
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleChange}
                      >
                        <option value="">Select Subcategory</option>
                        {subcategories[formData.category]?.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Pricing */}
                <div className="form-section">
                  <h3><FiDollarSign /> Pricing</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Current Price *</label>
                      <div className="input-with-prefix">
                        <span className="prefix">Rp</span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="0"
                          className={errors.price ? 'error' : ''}
                          min="0"
                          step="1000"
                        />
                      </div>
                      {errors.price && <span className="error-message">{errors.price}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Original Price</label>
                      <div className="input-with-prefix">
                        <span className="prefix">Rp</span>
                        <input
                          type="number"
                          name="originalPrice"
                          value={formData.originalPrice}
                          onChange={handleChange}
                          placeholder="0"
                          min="0"
                          step="1000"
                        />
                      </div>
                      {formData.originalPrice && formData.price && (
                        <div className="discount-info">
                          <span>Discount: {calculateDiscount()}%</span>
                          <button 
                            type="button" 
                            onClick={handleAutoFillDiscount}
                            className="btn-link"
                          >
                            Apply to Sale
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="checkbox-label large">
                        <input
                          type="checkbox"
                          name="sale"
                          checked={formData.sale}
                          onChange={handleChange}
                        />
                        <div>
                          <span>Mark as Sale Item</span>
                          <small>Product will appear in sale section</small>
                        </div>
                      </label>
                    </div>
                    
                    {formData.sale && (
                      <div className="form-group">
                        <label>Discount Percentage</label>
                        <div className="input-with-suffix">
                          <input
                            type="number"
                            name="salePercentage"
                            value={formData.salePercentage}
                            onChange={handleChange}
                            placeholder="0"
                            min="0"
                            max="100"
                          />
                          <span className="suffix">%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Media & Inventory */}
              <div className="form-column">
                {/* Product Image */}
                <div className="form-section">
                  <h3><FiImage /> Product Image</h3>
                  
                  <div className="form-group">
                    <label>Image URL *</label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className={errors.image ? 'error' : ''}
                    />
                    {errors.image && <span className="error-message">{errors.image}</span>}
                    <small className="form-help">
                      Supports JPG, PNG, WebP. Recommended size: 800x800px
                    </small>
                  </div>
                  
                  {/* Image Preview */}
                  <div className="image-preview-container">
                    {imagePreview && !imageError ? (
                      <div className="image-preview">
                        <img 
                          src={imagePreview} 
                          alt="Product Preview" 
                          onError={handleImageError}
                          onLoad={handleImageLoad}
                        />
                        <div className="image-preview-info">
                          <p>Image Preview</p>
                          <small>Click to view larger</small>
                        </div>
                        <button 
                          type="button" 
                          className="btn-image-fullscreen"
                          onClick={() => window.open(imagePreview, '_blank')}
                        >
                          View Full Size
                        </button>
                      </div>
                    ) : (
                      <div className="image-placeholder">
                        <FiImage size={48} />
                        <p>Image preview will appear here</p>
                        <small>Enter a valid image URL above</small>
                      </div>
                    )}
                    
                    {imageError && (
                      <div className="image-error">
                        <p>⚠️ Unable to load image. Please check the URL.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Inventory & Specifications */}
                <div className="form-section">
                  <h3><FiBox /> Inventory & Details</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Stock Quantity *</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="0"
                        className={errors.stock ? 'error' : ''}
                        min="0"
                      />
                      {errors.stock && <span className="error-message">{errors.stock}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Weight</label>
                      <div className="input-with-suffix">
                        <input
                          type="text"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          placeholder="2.5"
                        />
                        <span className="suffix">kg</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Specifications */}
                  <div className="form-group">
                    <label>Product Specifications</label>
                    <div className="spec-input">
                      <input
                        type="text"
                        placeholder="Key (e.g., Material)"
                        value={specInput.key}
                        onChange={(e) => setSpecInput({...specInput, key: e.target.value})}
                        onKeyPress={(e) => handleSpecKeyPress(e, 'key')}
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g., Nylon)"
                        value={specInput.value}
                        onChange={(e) => setSpecInput({...specInput, value: e.target.value})}
                        onKeyPress={(e) => handleSpecKeyPress(e, 'value')}
                      />
                      <button 
                        type="button" 
                        onClick={handleAddSpec}
                        className="btn-spec-add"
                        disabled={!specInput.key || !specInput.value}
                      >
                        Add
                      </button>
                    </div>
                    
                    {formData.specifications.length > 0 && (
                      <div className="specifications-list">
                        {formData.specifications.map((spec, index) => (
                          <div key={index} className="spec-item">
                            <span className="spec-key">{spec.key}:</span>
                            <span className="spec-value">{spec.value}</span>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveSpec(index)}
                              className="spec-remove"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Tags */}
                <div className="form-section">
                  <h3><FiTag /> Tags & Keywords</h3>
                  
                  <div className="form-group">
                    <label>Add Tags</label>
                    <div className="tag-input">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleTagKeyPress}
                        placeholder="Type tag and press Enter"
                      />
                      <button 
                        type="button" 
                        onClick={handleAddTag}
                        className="btn-tag-add"
                        disabled={!tagInput.trim()}
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="popular-tags">
                      <small>Popular tags:</small>
                      <div className="tag-suggestions">
                        {popularTags.map(tag => (
                          <button
                            key={tag}
                            type="button"
                            className={`tag-suggestion ${formData.tags.includes(tag) ? 'added' : ''}`}
                            onClick={() => handlePopularTagClick(tag)}
                          >
                            {tag}
                            {formData.tags.includes(tag) && ' ✓'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="tags-container">
                      {formData.tags.map(tag => (
                        <div key={tag} className="tag-item">
                          {tag}
                          <button 
                            type="button" 
                            onClick={() => handleRemoveTag(tag)}
                            className="tag-remove"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Summary Preview */}
            <div className="form-section preview-section">
              <h3>Product Preview</h3>
              <div className="product-preview">
                <div className="preview-image">
                  {imagePreview && !imageError ? (
                    <img src={imagePreview} alt="Preview" />
                  ) : (
                    <div className="preview-placeholder">
                      <FiPackage size={32} />
                    </div>
                  )}
                </div>
                <div className="preview-details">
                  <div className="preview-category">{formData.category}</div>
                  <h4 className="preview-name">{formData.name || 'Product Name'}</h4>
                  <p className="preview-description">
                    {formData.description || 'Product description will appear here...'}
                  </p>
                  <div className="preview-price">
                    <span className="current-price">
                      Rp {formData.price ? parseInt(formData.price).toLocaleString() : '0'}
                    </span>
                    {formData.originalPrice && formData.price < formData.originalPrice && (
                      <span className="original-price">
                        Rp {parseInt(formData.originalPrice).toLocaleString()}
                      </span>
                    )}
                    {formData.sale && (
                      <span className="sale-badge">
                        <FiPercent /> {formData.salePercentage}% OFF
                      </span>
                    )}
                  </div>
                  <div className="preview-stock">
                    <span className={`stock-indicator ${formData.stock > 10 ? 'in-stock' : 'low-stock'}`}>
                      {formData.stock || 0} in stock
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/admin/products')}
                className="btn btn-outline"
                disabled={loading}
              >
                <FiX /> Cancel
              </button>
              <div className="action-buttons">
                <button 
                  type="button" 
                  onClick={() => {
                    // Reset form
                    if (window.confirm('Are you sure? All changes will be lost.')) {
                      if (isEditMode) {
                        loadProductData();
                      } else {
                        setFormData({
                          id: formData.id, // Keep the same ID
                          name: '',
                          price: '',
                          originalPrice: '',
                          image: '',
                          description: '',
                          category: 'Camping',
                          subcategory: '',
                          stock: '10',
                          brand: '',
                          weight: '',
                          sale: false,
                          salePercentage: 0,
                          tags: [],
                          specifications: []
                        });
                        setImagePreview('');
                      }
                    }
                  }}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Reset
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner-small"></div> Saving...
                    </>
                  ) : (
                    <>
                      <FiSave /> {isEditMode ? 'Update Product' : 'Publish Product'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;