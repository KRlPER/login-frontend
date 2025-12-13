// src/pages/Locker.js
import React, { useEffect, useState } from "react";
import API from "../api";
import "./locker.css";
import { useNavigate } from "react-router-dom";

export default function Locker() {
  const userId = localStorage.getItem("userId");
  const [items, setItems] = useState([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [file, setFile] = useState(null);
  const [fileTitle, setFileTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get(`/locker/${userId}`);

      // FIX: API.get returns {success, items}
      if (res.success) setItems(res.items || []);
    } catch (err) {
      console.error("fetchItems:", err);
    }
  };

  const addNote = async (e) => {
  e.preventDefault();
  if (!noteText.trim()) return;

  setLoading(true);
  try {
    const res = await API.post(`/locker/${userId}`, {
      title: noteTitle,
      content: noteText
    });

    if (res.data && res.data.success) {
  setItems(prev => [res.data.item, ...prev]);
  setNoteTitle("");
  setNoteText("");
} else {
  alert(res.data?.error || "Failed to add note");
}

  } catch (err) {
    console.error("Note upload error:", err);
    alert("Internal error — check backend");
  }
  setLoading(false);
};


 const uploadFile = async (e) => {
  e.preventDefault();
  if (!file) return alert("Choose a file");

  setLoading(true);

  try {
    const fd = new FormData();
    fd.append("file", file);
    if (fileTitle) fd.append("title", fileTitle);

    const res = await API.post(`/locker/${userId}`, fd, {
      headers: { "Content-Type": "multipart/form-data" }
    });

   if (res.data && res.data.success) {
  setItems(prev => [res.data.item, ...prev]);
  setFile(null);
  setFileTitle("");
} else {
  alert(res.data?.error || "Failed to upload file");
}

  } catch (err) {
    console.error("File upload error:", err);
    alert("Internal error — check backend");
  }

  setLoading(false);
};


  // -------------------------
  // DELETE ITEM
  // -------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      const res = await API.delete(`/locker/item/${id}`);
      if (res.data && res.data.success) {
  setItems(prev => prev.filter(i => i.id !== id));
}

    } catch (err) {
      console.error("Delete error:", err);
      alert("Backend error while deleting");
    }
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="locker-page">

      <div className="locker-header">
        <h2>Your Digital Locker</h2>
        <button className="back-btn" onClick={() => navigate("/")}>
          Back to Dashboard
        </button>
      </div>

      {/* FORMS */}
      <div className="locker-actions">

        {/* NOTE FORM */}
        <form className="card note-form" onSubmit={addNote}>
          <input
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Title (optional)"
          />

          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write a private note..."
          />

          <button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Add Note"}
          </button>
        </form>

        {/* FILE FORM */}
        <form className="card file-form" onSubmit={uploadFile}>
          <input
            value={fileTitle}
            onChange={(e) => setFileTitle(e.target.value)}
            placeholder="File title (optional)"
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Uploading…" : "Upload File"}
          </button>
        </form>
      </div>

      {/* DISPLAY ITEMS */}
      <section className="locker-grid">

        {items.length === 0 && (
          <p className="empty-msg">No items yet — add a note or upload a file.</p>
        )}

        {items.map((item) => (
          <div className="locker-item card" key={item.id}>
            <div className="meta">
              <strong>
                {item.title || (item.type === "note" ? "Note" : "File")}
              </strong>
              <span className="date">
                {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
              </span>
            </div>

            {item.type === "note" ? (
              <p className="note-content">{item.content}</p>
            ) : (
              <div className="file-preview">
                {item.mime?.includes("image") ? (
                  <img src={`${API.defaults.baseURL}${item.file_path}`} />

                ) : (
                  <a
                    href={API.defaults.baseURL + item.file_path}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open file
                  </a>
                )}
              </div>
            )}

            <div className="actions">
              <button className="danger" onClick={() => handleDelete(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}

      </section>
    </div>
  );
}
