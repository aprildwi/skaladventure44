// pages/admin/ProductForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import productsData from '../../data/products.json'
import { 
  FiSave, FiX, FiUpload, FiImage, 
  FiDollarSign, FiPackage, FiTag, 
  FiEdit2, FiPlus
} from 'react-icons/fi';

function ProductForm() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const isEditMode = id !== 'new';
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    originalPrice: '',
    image: '',
    description: '',
    category: 'Camping',
    subcategory: '',
    stock: '',
    brand: '',
    weight: '',
    sale: false,
    salePercentage: 0,
    tags: []
  });
  
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');

  const categories = ['Camping', 'Hiking', 'Climbing', 'Water Sports'];
  const subcategories = {
    'Camping': ['Tent', 'Sleeping', 'Lighting', 'Cooking', 'Furniture'],
    'Hiking': ['Backpack', 'Footwear', 'Accessories', 'Navigation'],
    'Climbing': ['Safety', 'Clothing', 'Equipment'],
    'Water Sports': ['Dry Bag', 'Safety', 'Equipment']
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    if (isEditMode) {
      // Load product data for editing
      const savedProducts = JSON.parse(localStorage.getItem('skaladventure_products') || '[]');
      const product = savedProducts.find(p => p.id === parseInt(id));
      
      if (product) {
        setFormData({
          ...product,
          tags: product.tags || []
        });
      } else {
        navigate('/admin/products');
      }
    } else {
      // Generate new ID
      const savedProducts = JSON.parse(localStorage.getItem('skaladventure_products') || '[]');
      const newId = savedProducts.length > 0 
        ? Math.max(...savedProducts.map(p => p.id)) + 1 
        : productsData.length + 1;
      
      setFormData(prev => ({
        ...prev,
        id: newId
      }));
    }
  }, [id, isAdmin, navigate, isEditMode]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const savedProducts = JSON.parse(localStorage.getItem('skaladventure_products') || '[]');
      
      if (isEditMode) {
        // Update existing product
        const updatedProducts = savedProducts.map(p => 
          p.id === parseInt(id) ? { ...formData, id: parseInt(id) } : p
        );
        localStorage.setItem('skaladventure_products', JSON.stringify(updatedProducts));
      } else {
        // Add new product
        const newProduct = {
          ...formData,
          id: parseInt(formData.id)
        };
        const updatedProducts = [...savedProducts, newProduct];
        localStorage.setItem('skaladventure_products', JSON.stringify(updatedProducts));
      }
      
      setLoading(false);
      navigate('/admin/products');
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
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

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div className="admin-welcome">
            <h1>
              {isEditMode ? <FiEdit2 /> : <FiPlus />}
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p>{isEditMode ? 'Update product information' : 'Create a new product listing'}</p>
          </div>
          <div className="admin-actions">
            <button onClick={() => navigate('/admin/products')} className="btn btn-outline">
              <FiX /> Cancel
            </button>
          </div>
        </div>

        <div className="admin-section">
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-grid">
              {/* Left Column */}
              <div className="form-column">
                {/* Basic Information */}
                <div className="form-section">
                  <h3><FiPackage /> Basic Information</h3>
                  
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
                  </div>
                  
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter product description"
                      rows="4"
                      className={errors.description ? 'error' : ''}
                    />
                    {errors.description && <span className="error-message">{errors.description}</span>}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Subcategory</label>
                      <select
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleChange}
                      >
                        <option value="">Select subcategory</option>
                        {subcategories[formData.category]?.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Brand</label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="Enter brand name"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Weight</label>
                      <input
                        type="text"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="e.g., 2.5 kg"
                      />
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
                          placeholder="Enter price"
                          className={errors.price ? 'error' : ''}
                          min="0"
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
                          placeholder="Original price (if on sale)"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="sale"
                          checked={formData.sale}
                          onChange={handleChange}
                        />
                        <span>Mark as Sale Item</span>
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
              
              {/* Right Column */}
              <div className="form-column">
                {/* Image */}
                <div className="form-section">
                  <h3><FiImage /> Product Image</h3>
                  
                  <div className="form-group">
                    <label>Image URL *</label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="Enter image URL"
                      className={errors.image ? 'error' : ''}
                    />
                    {errors.image && <span className="error-message">{errors.image}</span>}
                  </div>
                  
                  {formData.image && (
                    <div className="image-preview">
                      <img src={formData.image} alt="Preview" />
                      <div className="image-preview-info">
                        <p>Image Preview</p>
                        <small>Make sure the image is high quality</small>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Inventory */}
                <div className="form-section">
                  <h3>Inventory</h3>
                  
                  <div className="form-group">
                    <label>Stock Quantity *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="Enter stock quantity"
                      className={errors.stock ? 'error' : ''}
                      min="0"
                    />
                    {errors.stock && <span className="error-message">{errors.stock}</span>}
                  </div>
                </div>
                
                {/* Tags */}
                <div className="form-section">
                  <h3><FiTag /> Tags</h3>
                  
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
                      <button type="button" onClick={handleAddTag} className="btn-tag-add">
                        Add
                      </button>
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
            
            {/* Form Actions */}
            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/admin/products')}
                className="btn btn-outline"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : (
                  <>
                    <FiSave /> {isEditMode ? 'Update Product' : 'Save Product'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;