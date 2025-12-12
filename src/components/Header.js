// src/components/Header.js
import React, { useContext, useRef, useState } from "react";
import API from "../api";
import { AuthContext } from "../AuthContext";
import "./Header.css";

export default function Header({ onOpenAdd }) {
  const { user, setUser, logout } = useContext(AuthContext);
  const [hovering, setHovering] = useState(false);
  const fileRef = useRef();

  const userId = localStorage.getItem("userId");

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("photo", file);
    try {
      const res = await API.post(`/upload-photo/${userId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        const newPhoto = res.data.photo;
        // update local storage + context
        const updated = { ...(user || {}), photo: newPhoto };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser && setUser(updated);
      } else {
        alert(res.data.error || "Upload failed");
      }
    } catch (err) {
      console.error("upload error", err);
      alert("Upload failed");
    }
  };

  return (
    <header className="app-header">
      <div className="left">
        <div className="logo">
          <div className="logo-mark" />
          <div className="logo-text">LockerBox</div>
        </div>
        <div className="tagline">Private notes & files — fast</div>
      </div>

      <div className="right">
        <button className="btn ghost" onClick={onOpenAdd}>
          + Add to Locker
        </button>

        <div
          className="profile-wrap"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <div className="avatar">
            {user?.photo ? (
              <img src={API.defaults.baseURL + user.photo} alt="profile" />
            ) : (
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3.2" stroke="#fff" strokeWidth="1.2" />
                <path d="M3 20c0-3.3 3.6-6 9-6s9 2.7 9 6" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            )}
          </div>

          <div className={`profile-card ${hovering ? "show" : ""}`}>
            <div className="pc-row">
              <div className="pc-avatar">
                {user?.photo ? (
                  <img src={API.defaults.baseURL + user.photo} alt="profile" />
                ) : (
                  <div className="pc-initial">{(user?.name || "U").charAt(0).toUpperCase()}</div>
                )}
              </div>
              <div>
                <div className="pc-name">{user?.name}</div>
                <div className="pc-email">{user?.email}</div>
              </div>
            </div>

            <div className="pc-actions">
              <label className="pc-upload">
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} />
                Upload Photo
              </label>
              <button className="pc-logout" onClick={() => { logout(); }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
