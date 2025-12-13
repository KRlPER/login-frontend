// src/pages/Profile.js
import React, { useState, useEffect, useRef, useContext } from "react";
import API from "../api";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [showCard, setShowCard] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) navigate("/login");
  }, [userId, navigate]);

  // Upload Profile Photo
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoUploading(true);

    try {
      const fd = new FormData();
      fd.append("photo", file);

      const res = await API.post(`/upload-photo/${userId}`, fd);
      if (res.success) {
        const updatedUser = { ...user, photo: res.photo };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Upload error:", err);
    }

    setPhotoUploading(false);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <header className="topbar">
        <h2>Welcome, {user?.name}</h2>

        {/* Profile Image Hover Area */}
        <div
          className="profile-hover-area"
          onMouseEnter={() => setShowCard(true)}
          onMouseLeave={() => setShowCard(false)}
        >
          <img
            src={
              user?.photo
                ? API.defaults.baseURL + user.photo
                : "/default-avatar.png"
            }
            alt="profile"
            className="profile-icon"
          />

          {/* Hover Card */}
          <div
            ref={cardRef}
            className={`profile-card ${showCard ? "visible" : ""}`}
          >
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>

            <label className="upload-btn">
              {photoUploading ? "Uploading…" : "Upload Photo"}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>
        </div>

        {/* Logout button kept outside hover card */}
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </header>

      <section className="actions">
        <button onClick={() => navigate("/locker")} className="go-locker-btn">
          Go to Locker
        </button>
      </section>
    </div>
  );
}
