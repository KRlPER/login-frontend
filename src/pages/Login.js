// src/pages/Login.js
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api"; // adjust import if you placed file at src/api.js
import { AuthContext } from "../AuthContext";
import "./AuthStyles.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    if (loading) return;
    setLoading(true);

    try {
      // API.post returns { status, data } or throws with err.status + err.response
      const res = await API.post("/login", { email, password });

      // normalize
      const status = res.status;
      const data = res.data;

      if (status === 200 && (data?.success || data?.user)) {
        const user = data.user || data;
        const normalized = {
          id: user.id || user._id || user.userId || null,
          name: user.name,
          email: user.email,
          photo: user.photo || user.profile || null,
          ...user,
        };

        localStorage.setItem("user", JSON.stringify(normalized));
        if (normalized.id) localStorage.setItem("userId", normalized.id);
        setUser && setUser(normalized);

        // navigate to main dashboard
        navigate("/dashboard", { replace: true });
        return;
      }

      // fallback message if shape is unexpected
      setMessage(data?.error || data?.message || "Invalid credentials");
    } catch (err) {
      console.error("Login error:", err);

      const status = err.status || err.response?.status;

      if (status === 401) {
        setMessage("Invalid email or password.");
      } else if (status === 0 || status === undefined) {
        // network / CORS / fetch failure
        setMessage("Unable to reach server. Check backend and CORS.");
      } else {
        setMessage(err.response?.message || err.message || "Login failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card slide-up">
        <h2>Sign in</h2>
        <p className="subtitle">Access your LockerBox dashboard</p>

        <form onSubmit={handleLogin} className="auth-form">
          <input
            className="auth-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
