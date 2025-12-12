// src/App.js
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.js";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Locker from "./pages/Locker"; // <- make sure file is named Locker.js (capital L)
import Dashboard from "./pages/Dashboard";

import { AuthProvider, AuthContext } from "./AuthContext";
import "./index.css";

/**
 * ProtectedRoute - wraps routes that require authentication.
 * If user not present, redirect to /login.
 */
function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/**
 * AuthGate - used for root path "/".
 * If user is logged in, redirect to dashboard, otherwise show Home.
 */
function AuthGate() {
  const { user } = useContext(AuthContext);
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Home />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Root: show Home when logged out, otherwise redirect to dashboard */}
          <Route path="/" element={<AuthGate />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/locker"
            element={
              <ProtectedRoute>
                <Locker />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
