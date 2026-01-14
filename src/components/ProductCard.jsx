// components/ProductCard.jsx
import { Link } from 'react-router-dom';
import { useCart, useWishlist } from '../context/CartContext';
import { FiShoppingCart, FiHeart, FiStar, FiPercent } from 'react-icons/fi';
import { MdCheck } from 'react-icons/md';
import { useState } from 'react';

function ProductCard({ product }) {
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleWishlist(product);
  };

  // Determine badge
  const getBadge = () => {
    if (product.discount && product.discount > 0) {
      return { type: 'sale', text: `${product.discount}% OFF` };
    }
    
    if (product.originalPrice) {
      const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
      if (discount > 0) {
        return { type: 'sale', text: `${discount}% OFF` };
      }
    }
    
    if (product.id <= 5) return { type: 'new', text: 'NEW' };
    if (product.stock < 10) return { type: 'best', text: 'BEST' };
    if (product.price > 1000000) return { type: 'sale', text: 'SALE' };
    return null;
  };

  const badge = getBadge();
  const isWishlisted = isInWishlist(product.id);
  const inCart = isInCart(product.id);

  // Format deskripsi untuk ditampilkan
  const formatDescription = (desc) => {
    if (!desc) return '';
    // Potong jika terlalu panjang, tapi biarkan lebih panjang dari sebelumnya
    if (desc.length > 120) {
      return desc.substring(0, 120) + '...';
    }
    return desc;
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="product-card-link"
    >
      <div className="product-card">
        {badge && (
          <div className={`product-badge ${badge.type}`}>
            {badge.type === 'sale' && <FiPercent className="badge-icon" />}
            {badge.text}
          </div>
        )}

        <button
          className={`product-wishlist ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FiHeart />
        </button>

        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-content">
          <span className="product-category">{product.category}</span>
          
          <h3 className="product-title">{product.name}</h3>
          
          {/* DESKRIPSI - Tampilkan di semua device */}
          <p className="product-description">
            {formatDescription(product.description)}
          </p>
          
          <div className="product-rating">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`star ${i < 4 ? 'filled' : ''}`}
              />
            ))}
            <span className="rating-count">(4.5)</span>
          </div>

          <div className="product-footer">
            <div className="product-price">
              <span className="current-price">
                Rp {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="old-price">
                  Rp {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Desktop-only buttons */}
            <div className="product-actions" onClick={(e) => e.preventDefault()}>
              <button
                className={`btn-cart ${isAdded ? 'added' : ''} ${inCart ? 'in-cart' : ''}`}
                onClick={handleAddToCart}
                disabled={isAdded}
              >
                {isAdded ? <MdCheck /> : <FiShoppingCart />}
                {isAdded ? 'Added' : inCart ? 'Add More' : 'Add'}
              </button>
              <div className="btn-detail">
                Details
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;