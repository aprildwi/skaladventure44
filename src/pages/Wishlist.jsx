// pages/Wishlist.jsx
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/CartContext';
import { FiHeart, FiArrowLeft, FiTrash2 } from 'react-icons/fi';

function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <h1><FiHeart /> My Wishlist</h1>
          <Link to="/products" className="continue-shopping">
            <FiArrowLeft /> Continue Shopping
          </Link>
        </div>
        
        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">
              <FiHeart />
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Add products you like to your wishlist for easy access.</p>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="wishlist-count">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in wishlist
            </div>
            
            <div className="wishlist-grid">
              {wishlistItems.map(product => (
                <div key={product.id} className="wishlist-item">
                  <div className="wishlist-item-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  
                  <div className="wishlist-item-details">
                    <span className="wishlist-category">{product.category}</span>
                    <h3 className="wishlist-title">{product.name}</h3>
                    <p className="wishlist-description">{product.description}</p>
                    <div className="wishlist-price">
                      Rp {product.price.toLocaleString()}
                    </div>
                    
                    <div className="wishlist-actions">
                      <Link to={`/product/${product.id}`} className="btn btn-primary">
                        View Details
                      </Link>
                      <button 
                        onClick={() => removeFromWishlist(product.id)}
                        className="btn btn-outline remove-btn"
                      >
                        <FiTrash2 /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Wishlist;