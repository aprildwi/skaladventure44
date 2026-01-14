// pages/ProductDetail.jsx - UPDATE LENGKAP
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useCart, useWishlist } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // TAMBAHKAN IMPORT INI
import { FiShoppingCart, FiTruck, FiShield, FiArrowLeft, FiHeart, FiStar, FiCreditCard } from 'react-icons/fi';
import productsData from '../data/products.json';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // TAMBAHKAN INI
  const { user } = useAuth(); // TAMBAHKAN INI
  const product = productsData.find(p => p.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  const images = [product.image];
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login', { 
        state: { from: location.pathname } 
      });
      return;
    }
    
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleCheckout = () => {
    if (!user) {
      // Redirect to login
      navigate('/login', { 
        state: { from: location.pathname } 
      });
      return;
    }
  
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleWishlist = () => {
    toggleWishlist(product);
  };

  const relatedProducts = productsData
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="product-detail-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-button">
          <FiArrowLeft /> Back
        </button>

        <div className="product-detail-container">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image-container-fixed">
              <img 
                src={images[selectedImage]} 
                alt={product.name} 
                className="main-image-fixed"
              />
            </div>
            <div className="image-thumbnails">
              {images.map((img, index) => (
                <button
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <div className="product-header-top">
                <span className="product-category">{product.category}</span>
                <button
                  className={`wishlist-button ${isWishlisted ? 'active' : ''}`}
                  onClick={handleWishlist}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <FiHeart />
                </button>
              </div>
              <h1>{product.name}</h1>
              <div className="product-rating">
                ★★★★★ <span>(4.5 • 128 reviews)</span>
              </div>
            </div>

            <div className="product-price-section">
              <div className="price">Rp {product.price.toLocaleString()}</div>
              <div className="stock-status">
                {product.stock > 10 ? 'In Stock' : 'Low Stock'}
              </div>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
              <ul className="product-specs">
                <li><strong>Brand:</strong> {product.brand}</li>
                <li><strong>Weight:</strong> {product.weight}</li>
                <li><strong>Category:</strong> {product.category}</li>
              </ul>
            </div>

            {/* Desktop Action Buttons */}
            <div className="product-actions-desktop">
              <div className="quantity-selector">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="quantity-btn"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="quantity">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="quantity-btn"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="action-buttons">
                <button onClick={handleAddToCart} className="btn btn-primary">
                  <FiShoppingCart /> Add to Cart
                </button>
                <button onClick={handleBuyNow} className="btn btn-secondary">
                  Buy Now
                </button>
              </div>
            </div>

            <div className="product-features">
              <div className="feature">
                <FiTruck />
                <div>
                  <h4>Free Shipping</h4>
                  <p>On orders over Rp 500,000</p>
                </div>
              </div>
              <div className="feature">
                <FiShield />
                <div>
                  <h4>2-Year Warranty</h4>
                  <p>Quality guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>Related Products</h2>
            <div className="product-grid">
              {relatedProducts.map(product => (
                <div key={product.id} className="related-product-card">
                  <img src={product.image} alt={product.name} />
                  <h4>{product.name}</h4>
                  <p>Rp {product.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;