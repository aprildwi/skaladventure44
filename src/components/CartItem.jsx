// components/CartItem.jsx
import { useState } from 'react';
import { FiTrash, FiMinus, FiPlus } from 'react-icons/fi';

function CartItem({ item, onRemove, onUpdateQuantity }) {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onUpdateQuantity(item.id, newQuantity);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  const subtotal = item.price * quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.image} alt={item.name} />
      </div>
      
      <div className="cart-item-details">
        <h4 className="cart-item-title">{item.name}</h4>
        <p className="cart-item-category">{item.category}</p>
        <p className="cart-item-price">Rp {item.price.toLocaleString()}</p>
      </div>
      
      <div className="cart-item-quantity">
        <button 
          onClick={handleDecrease} 
          disabled={quantity <= 1}
          className="quantity-btn"
        >
          <FiMinus />
        </button>
        <span className="quantity-value">{quantity}</span>
        <button onClick={handleIncrease} className="quantity-btn">
          <FiPlus />
        </button>
      </div>
      
      <div className="cart-item-total">
        <p>Rp {subtotal.toLocaleString()}</p>
      </div>
      
      <div className="cart-item-remove">
        <button onClick={handleRemove} className="remove-btn">
          <FiTrash />
        </button>
      </div>
    </div>
  );
}

export default CartItem;