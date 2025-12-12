// src/pages/Home.js
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function Home() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user) {
    return (
      <div style={{ maxWidth: 900, margin: "48px auto", padding: 20, textAlign: "center" }}>
        <h1>Welcome back, {user.name} 👋</h1>
        <p>Open your profile or use your personal digital locker.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button onClick={() => navigate("/locker")}>Locker</button>
          <button onClick={() => { logout(); navigate("/"); }}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "48px auto", padding: 20, textAlign: "center" }}>
      <h1>Personal Digital Locker</h1>
      <p>A simple private space to store notes and files. Create an account or sign in to get started.</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
        <Link to="/login"><button>Login</button></Link>
        <Link to="/register"><button>Register</button></Link>
      </div>
      <p style={{ marginTop: 16, color: "#666" }}>
        Files you upload are private to your account.
      </p>
    </div>
  );
}
