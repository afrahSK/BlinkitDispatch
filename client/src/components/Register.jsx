import React, { useState } from "react";

const Register = ({ isOpen, onClose, switchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("working")
    setMessage(""); // Clear any previous message

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessageType("success");
        setMessage("Registration successful!");
        console.log(message);
        setFormData({ firstName: "", lastName: "", email: "", password: "" }); // Clear inputs
        setTimeout(() => {
            switchToLogin();
        }, 500);
    } else {
        setMessageType("error");
        setMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      console.log(message);
      setMessageType("error");
      setMessage("Error connecting to the server.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>Sign up</h2>
        <p>for seamless shopping and delivery</p>

        {message && (
          <div className={`modal-message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form register-form">
          <div className="form-group">
            <input
              className="inp"
              type="text"
              placeholder="First Name*"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <input
              className="inp"
              type="text"
              placeholder="Last Name*"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
          <input
            className="inp"
            type="email"
            placeholder="Email*"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            className="inp"
            type="password"
            placeholder="Password*"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <div className="terms">
            <input type="checkbox" className="cb-terms" required />
            <p>I agree to the Terms of Service and Privacy Policy.</p>
          </div>

          <button type="submit" className="btn register-btn">Create account</button>
          <p>Already have an account?</p>
          <a className="a-login" onClick={switchToLogin} style={{ cursor: "pointer", color: "blue" }}>Login</a>
        </form>
      </div>
    </div>
  );
};

export default Register;
