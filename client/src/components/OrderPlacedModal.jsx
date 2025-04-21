import React from 'react';
import { Link } from 'react-router-dom';
const OrderPlacedModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Order Placed Successfully!</h3>
        <p>Your order has been successfully placed. You can track it anytime.</p>
        <div className="modal-actions">
          <Link to="/track" className='link'>
          <button onClick={onClose} className="btn btn-cart">
            Track Your Order
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderPlacedModal;
