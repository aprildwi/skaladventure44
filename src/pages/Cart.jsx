// pages/Cart.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { FiShoppingBag, FiArrowLeft, FiTrash2 } from 'react-icons/fi';

function Cart() {
  const navigate = useNavigate();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotalPrice 
  } = useCart();

  const subtotal = getCartTotalPrice();
  const shipping = subtotal > 500000 ? 0 : 25000;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="cart-page">
      <div className="container">
        <h1><FiShoppingBag /> Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some adventure gear to your cart to continue shopping.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-container">
            {/* Cart Items */}
            <div className="cart-items">
              <div className="cart-header">
                <h2>Cart Items ({cartItems.length})</h2>
                <button onClick={clearCart} className="btn-clear">
                  <FiTrash2 /> Clear All
                </button>
              </div>
              
              <div className="cart-items-list">
                {cartItems.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </div>
              
              <Link to="/products" className="continue-shopping">
                <FiArrowLeft /> Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `Rp ${shipping.toLocaleString()}`}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (10%)</span>
                  <span>Rp {tax.toLocaleString()}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>Rp {total.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="shipping-info">
                {subtotal < 500000 ? (
                  <p>
                    Add Rp {(500000 - subtotal).toLocaleString()} more for free shipping
                  </p>
                ) : (
                  <p className="free-shipping">🎉 You've earned free shipping!</p>
                )}
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="btn-checkout"
              >
                Proceed to Checkout
              </button>
              
              <div className="payment-methods">
                <p>Secure payment with:</p>
                <div className="payment-icons">
                  <span>💳</span>
                  <span>🏦</span>
                  <span>📱</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;