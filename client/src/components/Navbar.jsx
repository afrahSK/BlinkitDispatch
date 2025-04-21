import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import Register from './Register';
import Login from './Login';

const Navbar = () => {
  const navigate = useNavigate();
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const openRegister = () => setRegisterOpen(true);
const closeRegister = () => setRegisterOpen(false);

const openLogin = () => setLoginOpen(true);
const closeLogin = () => setLoginOpen(false);
  // Read from localStorage when component mounts
  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
    }
  }, []);

  // Log out function
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
  
    // 1) Clear server‐side cart if you want
    if (token) {
      await fetch("http://localhost:5000/api/cart/clear", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  
    // 2) Remove everything from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
  
    // 3) Clear React state so UI updates immediately
    setUserName(null);
  
    // 4) Redirect to home or login page
    navigate("/");
  };
  
  

  // Optionally, this is useful if you want to react to login success
  const handleLoginSuccess = (name) => {
    localStorage.setItem("userName", name);
    setUserName(name);
    setLoginOpen(false); // Close modal after login
  };

  return (
    <>
      <div className="neon-bar">🚀 Dispatch is live!</div>
      <header className="navbar">
        <div className="logo">
          <Link className="link" to="/">
            BlinkIt<span>Dispatch</span>
          </Link>
        </div>
        <nav className="nav-links">
          <Link to="/products">PRODUCTS</Link>
          <Link to="/track/12345">TRACK ORDERS</Link>

          <a href="#support">SUPPORT</a>
        </nav>

        <Link to="/cart" className="link">
          <button className="btn btn-cart">
            <FontAwesomeIcon className="cart-icon" icon={faCartShopping} />
            <p>My Cart</p>
          </button>
        </Link>

        {!userName ? (
          <>
            <button className="btn register-btn" onClick={openRegister}>
              REGISTER
            </button>
          </>
        ) : (
          <div className="welcome-message">
            <p className="welcome-text">Welcome, {userName} 👋</p>
            <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        )}

        {/* Register Modal */}
        <Register
          isOpen={isRegisterOpen}
          onClose={closeRegister}
          switchToLogin={() => {
            closeRegister();
            openLogin();
          }}
        />

        {/* Login Modal */}
        <Login
          isOpen={isLoginOpen}
          onClose={closeLogin}
          switchToRegister={() => {
            closeLogin();
            openRegister();
          }}
          onLoginSuccess={handleLoginSuccess} // 👈 Add this prop to Login component
        />
      </header>
    </>
  );
};

export default Navbar;
