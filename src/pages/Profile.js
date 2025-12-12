// src/pages/Profile.js
import React, { useEffect, useState, useRef, useContext } from "react";
import API from "../api";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const videoRef = useRef(null);
  const { user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/profile/${userId}`);
        if (res.data.success && res.data.user) {
          setUserProfile(res.data.user);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [userId]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!photo) return alert("Please select a file or take a photo!");
    const formData = new FormData();
    formData.append("photo", photo);

    try {
      const res = await API.post(`/upload-photo/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        // update local profile & global user
        const newPhoto = res.data.photo;
        setUserProfile(prev => ({ ...prev, photo: newPhoto }));
        const updatedUser = { ...(user || {}), photo: newPhoto };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser && setUser(updatedUser);
        setPhoto(null);
      } else {
        alert(res.data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading photo");
    }
  };

  const startCamera = async () => {
    try {
      setUseCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Unable to access camera. Please allow permission.");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 300;
    canvas.height = video.videoHeight || 300;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
      setPhoto(file);
      alert("Photo captured! Click 'Upload Photo' to save.");
    }, "image/jpeg");
  };

  if (!userProfile) return <h2 style={{textAlign:"center", marginTop:40}}>Loading profile...</h2>;

  return (
    <div style={{ maxWidth:800, margin:"28px auto", padding:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h2>Profile</h2>
        <div>
          <button onClick={() => navigate("/locker")}>Open Locker</button>
          <button onClick={() => { logout(); navigate("/"); }} style={{ marginLeft:12 }}>Logout</button>
        </div>
      </div>

      <div style={{ textAlign:"center", marginTop:16 }}>
        <h3>{userProfile.name}</h3>
        <p>{userProfile.email}</p>

        {userProfile.photo ? (
          <img src={`${API.defaults.baseURL}${userProfile.photo}?t=${Date.now()}`} alt="Profile" width="150" height="150" style={{ borderRadius:75 }} />
        ) : (
          <p>No profile photo uploaded.</p>
        )}

        <div style={{ marginTop:16 }}>
          <form onSubmit={handleFileUpload}>
            <input type="file" accept="image/*" onChange={(e)=>setPhoto(e.target.files[0])} />
            <button type="submit" style={{ marginLeft:8 }}>Upload Photo</button>
          </form>
        </div>

        <hr style={{ margin:"24px 0" }} />

        <h4>Or take a picture</h4>
        {!useCamera ? (
          <button onClick={startCamera}>Start Camera</button>
        ) : (
          <div style={{ marginTop:12 }}>
            <video ref={videoRef} autoPlay playsInline width="320" height="240" style={{ borderRadius:8 }} />
            <div style={{ marginTop:8 }}>
              <button onClick={capturePhoto}>Capture</button>
              <button onClick={() => setUseCamera(false)} style={{ marginLeft:8 }}>Cancel</button>
            </div>
            {photo && <div style={{ marginTop:12 }}>
              <h5>Preview</h5>
              <img src={URL.createObjectURL(photo)} alt="preview" width="150" />
            </div>}
            <div style={{ marginTop:12 }}>
              <button onClick={handleFileUpload}>Upload Captured Photo</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
