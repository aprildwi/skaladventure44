import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiCreditCard, FiUser, FiMapPin, FiCheck } from 'react-icons/fi';

function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  
  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.phone.match(/^\d{10,13}$/)) newErrors.phone = 'Valid phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
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
        setOrderPlaced(true);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setErrors(step2Errors);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const orderSummary = {
    subtotal: 4250000,
    shipping: 0,
    tax: 425000,
    total: 4675000
  };

  if (orderPlaced) {
    return (
      <div className="checkout-success">
        <div className="container">
          <div className="success-content">
            <FiCheck className="success-icon" />
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your purchase. Your order confirmation has been sent to your email.</p>
            <p>Redirecting to homepage...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1><FiLock /> Secure Checkout</h1>
          <div className="checkout-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Shipping</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Payment</div>
            </div>
          </div>
        </div>

        <div className="checkout-container">
          {/* Checkout Form */}
          <div className="checkout-form">
            {step === 1 ? (
              <div className="form-step">
                <h2><FiUser /> Shipping Information</h2>
                
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
                  />
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
                    />
                  </div>
                  <div className="form-group">
                    <label>Postal Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="form-step">
                <h2><FiCreditCard /> Payment Information</h2>
                
                <div className="form-group">
                  <label>Card Number *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    className={errors.cardNumber ? 'error' : ''}
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
                    />
                    {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                  </div>
                </div>
              </div>
            )}

            <div className="checkout-navigation">
              {step > 1 && (
                <button onClick={() => setStep(1)} className="btn btn-outline">
                  Back
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
              <div className="order-item">
                <span>Tent 4 Person</span>
                <span>Rp 1,850,000</span>
              </div>
              <div className="order-item">
                <span>Sleeping Bag</span>
                <span>Rp 850,000</span>
              </div>
              <div className="order-item">
                <span>Backpack 70L</span>
                <span>Rp 1,250,000</span>
              </div>
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>Rp {orderSummary.subtotal.toLocaleString()}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>
              <div className="total-row">
                <span>Tax</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;