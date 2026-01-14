// pages/ProductDetail.jsx - UPDATE LENGKAP DENGAN TOMBOL CHECKOUT MOBILE
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart, useWishlist } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  FiShoppingCart, 
  FiTruck, 
  FiShield, 
  FiArrowLeft, 
  FiHeart, 
  FiStar, 
  FiCreditCard,
  FiPackage,
  FiCheck,
  FiAlertCircle
} from 'react-icons/fi';
import productsData from '../data/products.json';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const product = productsData.find(p => p.id === parseInt(id));
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  
  const { addToCart, isInCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isInUserCart = isInCart(product?.id);

  useEffect(() => {
    // Reset success message after 2 seconds
    if (cartSuccess) {
      const timer = setTimeout(() => {
        setCartSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [cartSuccess]);

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
    setIsAddingToCart(true);
    addToCart(product, quantity);
    
    // Show success feedback
    setCartSuccess(true);
    
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 500);
  };

  const handleBuyNow = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    handleAddToCart();
    setTimeout(() => {
      navigate('/cart');
    }, 600);
  };

  const handleDirectCheckout = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    handleAddToCart();
    setTimeout(() => {
      navigate('/checkout');
    }, 600);
  };

  const handleLoginAndCheckout = () => {
    navigate('/login', { 
      state: { from: location.pathname, action: 'checkout' } 
    });
  };

  const handleLoginAndCart = () => {
    navigate('/login', { 
      state: { from: location.pathname, action: 'cart' } 
    });
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
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="back-button">
          <FiArrowLeft /> Back
        </button>

        {/* User Status Indicator */}
        {!user && !isAdmin && (
          <div className="user-status-banner">
            <FiAlertCircle />
            <span>Login for faster checkout and order tracking</span>
            <button 
              onClick={handleLoginAndCart}
              className="btn-login-small"
            >
              Login
            </button>
          </div>
        )}

        {/* Cart Success Message */}
        {cartSuccess && (
          <div className="cart-success-message">
            <FiCheck />
            <span>Added to cart! {quantity} × {product.name}</span>
            <button 
              onClick={() => navigate('/cart')}
              className="btn-view-cart"
            >
              View Cart
            </button>
          </div>
        )}

        {/* Login Prompt Modal */}
        {showLoginPrompt && (
          <div className="login-prompt-modal">
            <div className="modal-overlay" onClick={() => setShowLoginPrompt(false)}></div>
            <div className="modal-content">
              <div className="modal-header">
                <FiAlertCircle />
                <h3>Login Required</h3>
                <button 
                  onClick={() => setShowLoginPrompt(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <p>You need to be logged in to proceed with checkout.</p>
                <div className="login-options">
                  <button 
                    onClick={handleLoginAndCheckout}
                    className="btn btn-primary"
                  >
                    <FiCreditCard /> Login & Checkout
                  </button>
                  <button 
                    onClick={handleLoginAndCart}
                    className="btn btn-outline"
                  >
                    <FiShoppingCart /> Login & View Cart
                  </button>
                </div>
                <p className="login-benefits">
                  Benefits: Order tracking, Faster checkout, Save addresses
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Product Detail Container */}
        <div className="product-detail-container">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image-container">
              <img 
                src={images[selectedImage]} 
                alt={product.name} 
                className="main-image"
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
                <FiStar className="filled" />
                <FiStar className="filled" />
                <FiStar className="filled" />
                <FiStar className="filled" />
                <FiStar className="half" />
                <span className="rating-text">4.5 • 128 reviews</span>
              </div>
            </div>

            <div className="product-price-section">
              <div className="price">Rp {product.price.toLocaleString()}</div>
              <div className={`stock-status ${product.stock > 10 ? 'in-stock' : 'low-stock'}`}>
                {product.stock > 10 ? 'In Stock' : 'Low Stock'}
                <span className="stock-count"> ({product.stock} available)</span>
              </div>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
              <ul className="product-specs">
                <li><strong>Brand:</strong> {product.brand}</li>
                <li><strong>Weight:</strong> {product.weight}</li>
                <li><strong>Category:</strong> {product.category}</li>
                {product.subcategory && (
                  <li><strong>Subcategory:</strong> {product.subcategory}</li>
                )}
              </ul>
            </div>

            {/* Desktop Quantity Selector */}
            <div className="quantity-section">
              <h4>Quantity</h4>
              <div className="quantity-selector">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="quantity-btn"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="quantity-btn"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <div className="quantity-total">
                Total: <strong>Rp {(product.price * quantity).toLocaleString()}</strong>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="desktop-action-buttons">
              <div className="action-buttons-grid">
                <button 
                  onClick={handleAddToCart}
                  className={`btn-cart-main ${isAddingToCart ? 'adding' : ''} ${isInUserCart ? 'in-cart' : ''}`}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? (
                    <>
                      <div className="spinner-small"></div>
                      Adding...
                    </>
                  ) : isInUserCart ? (
                    <>
                      <FiCheck /> Add More
                    </>
                  ) : (
                    <>
                      <FiShoppingCart /> Add to Cart
                    </>
                  )}
                </button>
                
                <button 
                  onClick={handleBuyNow}
                  className="btn-buy-now"
                  disabled={isAddingToCart}
                >
                  <FiPackage /> Buy Now
                </button>
                
                <button 
                  onClick={handleDirectCheckout}
                  className="btn-checkout-desktop"
                  disabled={isAddingToCart || !user}
                  title={!user ? 'Login to checkout' : ''}
                >
                  <FiCreditCard /> Checkout Now
                </button>
              </div>
            </div>

            {/* Product Features */}
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
              <div className="feature">
                <FiCheck />
                <div>
                  <h4>Easy Returns</h4>
                  <p>30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Action Bar - ENHANCED */}
        <div className="mobile-product-actions">
          <div className="mobile-quantity-section">
            <div className="mobile-quantity-controls">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="mobile-quantity-btn"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="mobile-quantity-value">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="mobile-quantity-btn"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <div className="mobile-quantity-total">
              Rp {(product.price * quantity).toLocaleString()}
            </div>
          </div>
          
          <div className="mobile-action-grid">
            {/* Cart Button */}
            <button 
              onClick={handleAddToCart}
              className={`mobile-action-btn mobile-cart-btn ${isAddingToCart ? 'adding' : ''} ${isInUserCart ? 'in-cart' : ''}`}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <div className="spinner-tiny"></div>
              ) : isInUserCart ? (
                <FiCheck />
              ) : (
                <FiShoppingCart />
              )}
              <span className="mobile-btn-label">
                {isAddingToCart ? 'Adding...' : isInUserCart ? 'Added' : 'Cart'}
              </span>
            </button>
            
            {/* Buy Now Button */}
            <button 
              onClick={handleBuyNow}
              className="mobile-action-btn mobile-buy-btn"
              disabled={isAddingToCart}
            >
              <FiPackage />
              <span className="mobile-btn-label">Buy Now</span>
            </button>
            
            {/* Checkout Button */}
            <button 
              onClick={handleDirectCheckout}
              className={`mobile-action-btn mobile-checkout-btn ${!user ? 'disabled' : ''}`}
              disabled={isAddingToCart || !user}
              title={!user ? 'Login to checkout' : 'Secure Checkout'}
            >
              <FiCreditCard />
              <span className="mobile-btn-label">Checkout</span>
              {!user && <span className="login-badge">Login</span>}
            </button>
          </div>
          
          {/* Quick Info Bar */}
          <div className="mobile-info-bar">
            <span className="stock-info">
              <span className={`stock-dot ${product.stock > 10 ? 'in-stock' : 'low-stock'}`}></span>
              {product.stock > 10 ? 'In Stock' : 'Low Stock'}
            </span>
            <span className="price-info">
              Rp {product.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>Related Products</h2>
            <div className="product-grid">
              {relatedProducts.map(relatedProduct => (
                <div 
                  key={relatedProduct.id} 
                  className="related-product-card"
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                >
                  <img src={relatedProduct.image} alt={relatedProduct.name} />
                  <h4>{relatedProduct.name}</h4>
                  <p>Rp {relatedProduct.price.toLocaleString()}</p>
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