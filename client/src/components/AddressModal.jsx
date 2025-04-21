// AddressModal.jsx
import React, { useState } from 'react';

const AddressModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    house: '',
    floor: '',
    area: '',
    name: '',
    phone: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.house || !form.area || !form.name) {
      alert("Please fill all required fields");
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Enter Delivery Address</h3>
        <input name="house" placeholder="House No. / Building Name" onChange={handleChange} required />
        <input name="floor" placeholder="Floor (Optional)" onChange={handleChange} />
        <input name="area" placeholder="Area / Sector / Locality" onChange={handleChange} required />
        <input name="name" placeholder="Your Name" onChange={handleChange} required />
        <input name="phone" placeholder="Phone Number (Optional)" onChange={handleChange} />
        <div className="modal-actions">
          <button onClick={onClose} className='btn btn-cart'>Cancel</button>
          <button onClick={handleSave} className='btn register-btn'>Add Address</button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
