import React, { useState, useEffect } from 'react';
import './app.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Products from './components/Products';
import Cart from './components/Cart';
import Track from './components/Track';

const App = () => {
  const [mode, setMode] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const addToCart = (product) => {
    setCartItems(prevItems => [...prevItems, product]);
  };

  useEffect(() => {
    if (!token) {
      setCartItems([]); // Clear cart if token doesn't exist (e.g., after logout)
      return;
    }

    console.log("⏳ cart‑fetch token:", token);
    console.log("username:", localStorage.getItem('userName'));

    fetch('http://localhost:5000/api/cart/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch cart');
        return res.json();
      })
      .then(data => {
        setCartItems(data.cart);
      })
      .catch(console.error);
  }, [token]); // Re-run when token changes

  return (
    <div>
      <Router>
        <Navbar
          onLoginClick={() => setMode("login")}
          onRegisterClick={() => setMode("register")}
        />

        {/* ————— Modals ————— */}
        <Login
          isOpen={mode === "login"}
          onClose={() => setMode(null)}
          switchToRegister={() => setMode("register")}
          setToken={setToken} // pass token updater
        />
        <Register
          isOpen={mode === "register"}
          onClose={() => setMode(null)}
          switchToLogin={() => setMode("login")}
        />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={
            <Login
              isOpen={mode === "login"}
              onClose={() => setMode(null)}
              switchToRegister={() => setMode("register")}
              setToken={setToken} // again pass it here too
            />
          } />
          <Route path='/products' element={
            <Products addToCart={(updateFn) => {
              setCartItems(prev =>
                typeof updateFn === 'function' ? updateFn(prev) : [...prev, updateFn]
              );
            }} />
          } />
          <Route path='/cart' element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path='/track/:orderId' element={<Track />} />

        </Routes>
      </Router>
    </div>
  );
};

export default App;
