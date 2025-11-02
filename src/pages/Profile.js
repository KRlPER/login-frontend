import React, { useEffect, useState, useRef } from "react";
import API from "../api";

function Profile() {
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const videoRef = useRef(null);
  const userId = localStorage.getItem("userId");

  // -----------------------
  // Fetch User Profile
  // -----------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/profile/${userId}`);
        setUser(res.data.user || res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [userId]);

  // -----------------------
  // File Upload (Instant Update)
  // -----------------------
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!photo) return alert("Please select a file or take a photo!");

    const formData = new FormData();
    formData.append("photo", photo);

    try {
      const res = await API.post(`/upload-photo/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message || "Photo uploaded successfully!");

      // ✅ Update user photo instantly instead of reloading
      setUser((prevUser) => ({
        ...prevUser,
        photo: res.data.photo, // use new uploaded photo path
      }));

      setPhoto(null); // clear file input
    } catch (err) {
      console.error(err);
      alert("Error uploading photo");
    }
  };

  // -----------------------
  // Start Camera
  // -----------------------
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

  // -----------------------
  // Capture Photo from Camera
  // -----------------------
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
      setPhoto(file);
      alert("Photo captured! Click 'Upload Photo' to save.");
    }, "image/jpeg");
  };

  if (!user) return <h2>Loading profile...</h2>;

  return (
    <div className="profile-container" style={{ textAlign: "center", padding: "20px" }}>
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>

      {user.photo ? (
        <img
          src={`${API.defaults.baseURL}${user.photo}?t=${Date.now()}`} // ✅ force refresh of new image
          alt="Profile"
          width="150"
          height="150"
          style={{ borderRadius: "50%", marginBottom: "10px" }}
        />
      ) : (
        <p>No profile photo uploaded.</p>
      )}

      {/* ---------------- FILE UPLOAD ---------------- */}
      <form onSubmit={handleFileUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
        />
        <button type="submit">Upload Photo</button>
      </form>

      {/* ---------------- CAMERA SECTION ---------------- */}
      <hr style={{ margin: "20px 0" }} />
      <h3>Or Take a Picture</h3>

      {!useCamera ? (
        <button onClick={startCamera}>Start Camera</button>
      ) : (
        <div>
          <video ref={videoRef} autoPlay playsInline width="300" height="200" />
          <div style={{ marginTop: "10px" }}>
            <button onClick={capturePhoto}>Capture Photo</button>
            {photo && (
              <div>
                <h4>Preview:</h4>
                <img src={URL.createObjectURL(photo)} alt="Preview" width="150" />
              </div>
            )}
            <button onClick={handleFileUpload}>Upload Photo</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
