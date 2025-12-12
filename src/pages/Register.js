// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import "./AuthStyles.css";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (loading) return;
    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      console.log("Register →", API.API_BASE, "/register");

      const res = await API.post("/register", { name, email, password });
      console.log("REGISTER RESPONSE:", res);

      const data = res.data ?? res;

      // SUCCESS condition
      if (res.status === 201 || data?.success || data?.message) {
        // SUCCESS — go immediately to login page
        navigate("/login");
        return;
      }

      // FAIL condition
      setMessage(data?.error || data?.message || "Registration failed.");
    } catch (err) {
      console.error("Register error:", err);

      if (err.response) {
        setMessage(err.response.data?.error || err.response.data?.message);
      } else {
        setMessage("Unable to reach server. Check backend and API_BASE.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card slide-up">
        <h2>Create Account</h2>
        <p className="subtitle">Join your private digital space ✨</p>

        <form onSubmit={handleRegister} className="auth-form">
          <input
            className="auth-input"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Choose Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
