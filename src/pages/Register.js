// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; // Axios instance

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/register", { name, email, password });

      // ✅ Flask backend returns { message: "...", ... }
      if (res.status === 201) {
        alert(res.data.message || "Registration successful!");
        navigate("/login");
      } else {
        setMessage(res.data.error || "Registration failed!");
      }
    } catch (err) {
      console.error("Error:", err);
      if (err.response && err.response.data.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage("Something went wrong. Try again!");
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">Register</button>
      </form>
      {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}
    </div>
  );
}

export default Register;
