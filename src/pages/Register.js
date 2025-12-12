// src/pages/Register.js
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../AuthContext";

export default function Register() {
  const { setUser } = useContext(AuthContext);
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
    if (!name.trim() || !email.trim() || !password) {
      setMessage("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      // 1) Register
      const res = await API.post("/register", { name, email, password });
      console.log("/register response:", res.status, res.data);

      if (res.status === 201 && res.data.success) {
        // 2) Immediately login
        try {
          const loginRes = await API.post("/login", { email, password });
          console.log("/login response:", loginRes.status, loginRes.data);
          if (loginRes.status === 200 && loginRes.data.success && loginRes.data.user) {
            const user = loginRes.data.user;
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("userId", user.id);
            setUser(user);
            navigate("/profile");
            return;
          } else {
            setMessage("Registered but login failed — try logging in.");
            navigate("/login");
            return;
          }
        } catch (loginErr) {
          console.error("Auto-login failed:", loginErr);
          setMessage("Registered but auto-login failed. Please login manually.");
          navigate("/login");
          return;
        }
      } else {
        // backend returned non-201 or success false
        const errMsg = res.data?.error || res.data?.message || "Registration failed";
        setMessage(errMsg);
      }
    } catch (err) {
      console.error("Register error:", err);
      // network / CORS / server error
      if (err.response) {
        // server responded with non-2xx
        setMessage(err.response.data?.error || err.response.data?.message || `Error: ${err.response.status}`);
      } else if (err.request) {
        // request made but no response
        setMessage("No response from server. Check backend and CORS.");
      } else {
        setMessage("Error registering. See console.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "48px auto", padding: 20 }}>
      <h2>Create account</h2>

      <form onSubmit={handleRegister} style={{ display: "grid", gap: 10 }}>
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
        />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder="Choose a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <button type="submit" disabled={loading} style={{ padding: "10px 12px" }}>
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      {message && <p style={{ color: "crimson", marginTop: 12 }}>{message}</p>}

      <p style={{ marginTop: 12 }}>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
