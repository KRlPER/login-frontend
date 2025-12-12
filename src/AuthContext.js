// src/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      console.error("Auth restore failed", e);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
