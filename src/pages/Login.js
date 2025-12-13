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
    setLoading(true);

    try {
      const res = await API.post("/login", { email, password });

      // API wrapper returns JSON (not axios)
      if (res.success) {
        const user = res.user;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user.id);
        setUser(user);

        navigate("/", { replace: true });
      } else {
        setMessage(res.error || "Invalid credentials");
      }

    } catch (err) {
      console.error("Login error:", err);
      setMessage("Server unreachable. Check Render backend.");
    }

    setLoading(false);
  };

  return (
    <div style={{
      maxWidth: 460,
      margin: "80px auto",
      padding: 20,
      fontFamily: "Inter, sans-serif",
    }}>
      
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>Welcome Back</h2>
        <p style={{ color: "#6b7280", marginTop: 6, fontSize: 15 }}>
          Sign in to access your Digital Locker
        </p>
      </div>

      {/* LOGIN FORM */}
      <form onSubmit={handleLogin} style={{ display: "grid", gap: 14 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid #dfe6f1",
            background: "#f9fbff",
            fontSize: 15
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid #dfe6f1",
            background: "#f9fbff",
            fontSize: 15
          }}
        />

        {/* BUTTON (original gradient restored!) */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 14px",
            borderRadius: 10,
            border: "none",
            background: "linear-gradient(90deg, #7c3aed, #06b6d4)",
            color: "white",
            fontWeight: 600,
            fontSize: 16,
            cursor: loading ? "default" : "pointer",
            transition: "0.2s",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      {/* ERROR MESSAGE */}
      {message && (
        <p style={{ color: "crimson", marginTop: 14, textAlign: "center", fontSize: 15 }}>
          {message}
        </p>
      )}

      {/* FOOTER */}
      <p style={{ marginTop: 20, textAlign: "center", color: "#6b7280" }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "#6366f1", fontWeight: 600 }}>
          Register
        </Link>
      </p>
    </div>
  );
}
