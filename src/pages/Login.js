// src/pages/Login.js
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../AuthContext";

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
      const res = await API.post("/login", { email, password });
      // expected: { success: true, user: { id, name, email, photo } }
      if (res.status === 200 && res.data && res.data.success && res.data.user) {
        const user = res.data.user;
        // persist user in local storage and context
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user.id);
        setUser && setUser(user);
        // go to dashboard (main page)
        navigate("/", { replace: true });
      } else {
        setMessage(res.data?.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      // axios error handling
      if (err.response) {
        setMessage(err.response.data?.error || `Error: ${err.response.status}`);
      } else if (err.request) {
        setMessage("No response from server — check your backend and CORS.");
      } else {
        setMessage("An unexpected error occurred. Check console.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 460, margin: "64px auto", padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <h2 style={{ margin: 0 }}>Sign in</h2>
        <p style={{ color: "#6b7280", marginTop: 6 }}>Access your LockerBox dashboard</p>
      </div>

      <form onSubmit={handleLogin} style={{ display: "grid", gap: 10 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          style={{ padding: 10, borderRadius: 8, border: "1px solid #e6eef8" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          style={{ padding: 10, borderRadius: 8, border: "1px solid #e6eef8" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            border: "none",
            background: "linear-gradient(90deg,#7c3aed,#06b6d4)",
            color: "white",
            fontWeight: 700,
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {message && <p style={{ color: "crimson", marginTop: 12 }}>{message}</p>}

      <p style={{ marginTop: 14, textAlign: "center", color: "#6b7280" }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
