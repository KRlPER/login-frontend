// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; // ✅ Import centralized API

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/login", { email, password });

      // ✅ Backend returns 200 + user object
      if (res.status === 200 && res.data.user) {
        localStorage.setItem("userId", res.data.user.id);
        alert(res.data.message || "Login successful!");
        navigate("/profile");
      } else {
        setMessage("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage("Error logging in. Please try again.");
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}
    </div>
  );
}

export default Login;
