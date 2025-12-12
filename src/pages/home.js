// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-root">
      <header className="home-hero">
        <div className="hero-left">
          <h1 className="hero-title">LockerBox</h1>
          <p className="hero-sub">
            Private notes, photos and PDFs — beautiful, fast and secure.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn primary">Get started</Link>
            <Link to="/login" className="btn ghost">Sign in</Link>
          </div>
        </div>
        <div className="hero-right">
          <div className="mock-card" aria-hidden>
            <div className="mock-header" />
            <div className="mock-body">
              <div className="mock-line" />
              <div className="mock-line short" />
              <div className="mock-thumb" />
            </div>
          </div>
        </div>
      </header>

      <section className="features">
        <div className="feature"><h3>Organize</h3><p>Add notes, photos or PDFs and find them quickly with categories.</p></div>
        <div className="feature"><h3>Private</h3><p>Your Locker is private — only you can access your items.</p></div>
        <div className="feature"><h3>Fast</h3><p>Instant uploads and a polished dashboard for desktop & mobile.</p></div>
      </section>
    </div>
  );
}
