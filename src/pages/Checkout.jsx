// pages/Checkout.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiLock, FiCreditCard, FiUser, FiMapPin, FiCheck, FiLogIn, FiAlertCircle } from 'react-icons/fi';

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { cartItems, getCartTotalPrice, clearCart } = useCart();
  
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    postalCode: user?.postalCode || '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  
  const [errors, setErrors] = useState({});

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      // Pre-fill user data if logged in
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      }));
    }
  }, [user]);

  // Check if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderPlaced]);

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.phone.match(/^\d{10,13}$/)) newErrors.phone = 'Valid phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.cardNumber.match(/^\d{16}$/)) newErrors.cardNumber = 'Valid card number is required';
    if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';
    if (!formData.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) newErrors.expiry = 'Valid expiry date (MM/YY)';
    if (!formData.cvv.match(/^\d{3,4}$/)) newErrors.cvv = 'Valid CVV required';
    return newErrors;
  };

  const handleNext = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    if (step === 1) {
      const step1Errors = validateStep1();
      if (Object.keys(step1Errors).length === 0) {
        setStep(2);
        setErrors({});
      } else {
        setErrors(step1Errors);
      }
    } else if (step === 2) {
      const step2Errors = validateStep2();
      if (Object.keys(step2Errors).length === 0) {
        // Submit order
        handlePlaceOrder();
      } else {
        setErrors(step2Errors);
      }
    }
  };

  const handlePlaceOrder = () => {
    // Simulate order processing
    const orderData = {
      id: `ORD-${Date.now()}`,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      items: cartItems,
      shipping: formData,
      payment: {
        cardLast4: formData.cardNumber.slice(-4),
        cardName: formData.cardName
      },
      total: orderSummary.total,
      date: new Date().toISOString(),
      status: 'processing'
    };

    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('skaladventure_orders') || '[]');
    localStorage.setItem('skaladventure_orders', JSON.stringify([...existingOrders, orderData]));

    // Clear cart
    clearCart();
    
    // Show success
    setOrderPlaced(true);
    
    // Redirect to home after 3 seconds
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login', { 
      state: { from: location.pathname } 
    });
  };

  const handleContinueAsGuest = () => {
    setShowLoginPrompt(false);
    // Allow guest checkout (optional)
  };

  const subtotal = getCartTotalPrice();
  const shipping = subtotal > 500000 ? 0 : 25000;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const orderSummary = {
    subtotal,
    shipping,
    tax,
    total
  };

  if (showLoginPrompt) {
    return (
      <div className="checkout-login-required">
        <div className="container">
          <div className="login-required-card">
            <FiAlertCircle className="warning-icon" />
            <h2>Login Required</h2>
            <p>You need to be logged in to proceed with checkout.</p>
            <p className="login-benefits">
              Benefits of logging in:
            </p>
            <ul className="benefits-list">
              <li>✓ Faster checkout with saved information</li>
              <li>✓ Track your order status</li>
              <li>✓ View order history</li>
              <li>✓ Save multiple shipping addresses</li>
            </ul>
            <div className="login-actions">
              <button onClick={handleLoginRedirect} className="btn btn-primary">
                <FiLogIn /> Login / Register
              </button>
              <button onClick={() => navigate('/cart')} className="btn btn-outline">
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="checkout-success">
        <div className="container">
          <div className="success-content">
            <FiCheck className="success-icon" />
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your purchase, {user?.name}!</p>
            <p>Your order confirmation has been sent to {user?.email}</p>
            <p>Order ID: ORD-{Date.now().toString().slice(-6)}</p>
            <p className="redirect-message">Redirecting to homepage...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <div className="header-top">
            <h1><FiLock /> Secure Checkout</h1>
            <div className="user-info">
              <span>Logged in as: {user?.name}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          
          <div className="checkout-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Shipping</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Payment</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Confirmation</div>
            </div>
          </div>
        </div>

        <div className="checkout-container">
          {/* Checkout Form */}
          <div className="checkout-form">
            {step === 1 ? (
              <div className="form-step">
                <h2><FiUser /> Shipping Information</h2>
                
                <div className="user-note">
                  <FiCheck className="check-icon" />
                  <span>Logged in as {user?.name}. Your profile information is pre-filled.</span>
                </div>
                
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    readOnly={!!user}
                  />
                  {user && <small className="form-help">Email cannot be changed (logged in as {user.email})</small>}
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="081234567890"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label><FiMapPin /> Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={errors.address ? 'error' : ''}
                    rows="3"
                    placeholder="Full address including street, building, etc."
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label>Postal Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className={errors.postalCode ? 'error' : ''}
                    />
                    {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="form-step">
                <h2><FiCreditCard /> Payment Information</h2>
                
                <div className="payment-methods">
                  <div className="method active">
                    <input type="radio" name="paymentMethod" id="creditCard" defaultChecked />
                    <label htmlFor="creditCard">
                      <FiCreditCard /> Credit/Debit Card
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Card Number *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    className={errors.cardNumber ? 'error' : ''}
                    maxLength="16"
                  />
                  {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                </div>

                <div className="form-group">
                  <label>Name on Card *</label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="JOHN DOE"
                    className={errors.cardName ? 'error' : ''}
                  />
                  {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Expiry Date (MM/YY) *</label>
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleChange}
                      placeholder="12/26"
                      className={errors.expiry ? 'error' : ''}
                      maxLength="5"
                    />
                    {errors.expiry && <span className="error-message">{errors.expiry}</span>}
                  </div>
                  <div className="form-group">
                    <label>CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      className={errors.cvv ? 'error' : ''}
                      maxLength="4"
                    />
                    {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                  </div>
                </div>
              </div>
            )}

            <div className="checkout-navigation">
              {step > 1 && (
                <button onClick={() => setStep(1)} className="btn btn-outline">
                  Back to Shipping
                </button>
              )}
              <button onClick={handleNext} className="btn btn-primary">
                {step === 1 ? 'Continue to Payment' : 'Place Order'}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            
            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">× {item.quantity}</span>
                  </div>
                  <span className="item-price">
                    Rp {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>Rp {orderSummary.subtotal.toLocaleString()}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'free' : ''}>
                  {shipping === 0 ? 'FREE' : `Rp ${shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="total-row">
                <span>Tax (10%)</span>
                <span>Rp {orderSummary.tax.toLocaleString()}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>Rp {orderSummary.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="security-notice">
              <FiLock />
              <span>Your payment is secured with 256-bit SSL encryption</span>
            </div>
            
            <div className="user-checkout-info">
              <p><strong>Checking out as:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;