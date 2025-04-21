import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ isOpen, onClose, switchToRegister, onLoginSuccess, setToken }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [type, setType] = useState("info");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setType("error");
        setMsg(data.msg);
        console.log(data);
        return;
      }

      setType("success");
      setMsg("Welcome back!");
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);

      // ✅ This triggers useEffect in App.js to re-fetch cart
      if (setToken) setToken(data.token);

      if (onLoginSuccess) onLoginSuccess(data.name);

      setTimeout(onClose, 800);
    } catch (err) {
      setType("error");
      setMsg("Network error, try again.");
      console.log(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>Welcome back</h2>
        <p>Sign in to continue</p>

        {msg && (
          <div
            className={`modal-msg ${type}`}
            style={{
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "4px",
              color: type === "error" ? "#b91c1c" : "#065f46",
              backgroundColor: type === "error" ? "#fee2e2" : "#d1fae5",
              border: `1px solid ${type === "error" ? "#fca5a5" : "#6ee7b7"}`,
            }}
          >
            {msg}
          </div>
        )}

        <form onSubmit={handleLogin} className="form login-form">
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
          <button type="submit" className="btn login-btn">Login</button>

          <p style={{ marginTop: "10px" }}>
            Don't have an account?{" "}
            <span
              onClick={switchToRegister}
              className="a-login"
              style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
