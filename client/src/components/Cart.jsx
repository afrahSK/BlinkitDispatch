import React, { useState } from 'react';
import AddressModal from './AddressModal';
import OrderPlacedModal from './OrderPlacedModal';

const Cart = ({ cartItems, setCartItems }) => {
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [address, setAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showOrderPlacedModal, setShowOrderPlacedModal] = useState(false);

  const handlePlaceOrder = () => {
    setShowOrderPlacedModal(true);
    setCartItems([]); // clear cart after order
  };

  const handleRemoveItem = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
  };

  const handleQuantityChange = (index, value) => {
    const updatedCart = [...cartItems];
    const qty = parseInt(value);
    if (!isNaN(qty) && qty > 0) {
      updatedCart[index].quantity = qty;
      setCartItems(updatedCart);
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items-list">
            {cartItems.map((item, idx) => (
              <div key={idx} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  <p><strong>Total: ₹{item.price * item.quantity}</strong></p>
                  <div>
                    <label>Quantity: </label>
                    <input className='quant-inpy'
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(idx, e.target.value)}
                    />
                  </div>

                  <button
                    className="remove-button"
                    onClick={() => handleRemoveItem(idx)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <p className="total-price">Total: ₹{totalPrice}</p>
            {address ? (
              <>
                <div className="address-display">
                  <p><strong>Your saved address</strong></p>
                  <p>{address.name},</p>
                  <p>
                    {address.house},{' '}
                    {address.floor && `Floor: ${address.floor}, `}
                    {address.area}
                  </p>

                  <p>{address.phone}</p>
                </div>
                <button
                  className="checkout-button"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </button>
              </>
            ) : (
              <button
                className="checkout-button"
                onClick={() => setShowAddressModal(true)}
              >
                Proceed to Buy
              </button>
            )}
          </div>
        </>
      )}

      {showAddressModal && (
        <AddressModal
          onClose={() => setShowAddressModal(false)}
          onSave={async (addr) => {
            try {
              const res = await fetch('http://localhost:5000/api/cart/save-address', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(addr),

              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.msg);
              setAddress(data.address); // set the saved address to display
              setShowAddressModal(false); // close modal after saving
            } catch (err) {
              alert('Failed to save address: ' + err.message);
            }
          }}

        />
      )}

      {showOrderPlacedModal && (
        <OrderPlacedModal
          onClose={() => setShowOrderPlacedModal(false)}
        />
      )}
    </div>
  );
};

export default Cart;
