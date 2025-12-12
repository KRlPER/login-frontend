// src/pages/Dashboard.js
import React, { useEffect, useState, useCallback } from "react";
import API from "../api";
import Header from "../components/Header";
import "./Dashboard.css";

/**
 * Dashboard - main logged-in page showing all locker items,
 * with Add modal and category filters.
 */
export default function Dashboard() {
  const userId = localStorage.getItem("userId");
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");

  // stable fetch function (useCallback removes eslint warning)
  const fetchItems = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await API.get(`/locker/${userId}`);
      if (res.data && res.data.success) {
        setItems(res.data.items || []);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("fetch items error", err);
    }
  }, [userId]);

  // call the stable function; include fetchItems in deps
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // called by AddModal to push the newly-created item into the UI
  const onAdded = (newItem) => {
    if (newItem) setItems((prev) => [newItem, ...prev]);
    else fetchItems();
  };

  const categories = {
    all: "All",
    note: "Notes",
    file: "Files",
    image: "Images",
    pdf: "PDFs",
  };

  const filtered = items.filter((it) => {
    if (filter === "all") return true;
    if (filter === "image") return it.mime && it.mime.startsWith("image");
    if (filter === "pdf") return it.mime && it.mime.includes("pdf");
    return it.type === filter;
  });

  return (
    <>
      <Header onOpenAdd={() => setShowAdd(true)} />
      <main className="dashboard">
        <section className="hero">
          <h1>Welcome back</h1>
          <p className="lead">Your private space for notes & files.</p>
        </section>

        <section className="controls">
          <div className="chips">
            {Object.keys(categories).map((k) => (
              <button
                key={k}
                className={`chip ${filter === k ? "active" : ""}`}
                onClick={() => setFilter(k)}
              >
                {categories[k]}
              </button>
            ))}
          </div>

          <div className="stats">
            <div className="stat">
              <div className="value">{items.length}</div>
              <div className="label">Total Items</div>
            </div>
            <div className="stat">
              <div className="value">{items.filter((i) => i.type === "note").length}</div>
              <div className="label">Notes</div>
            </div>
            <div className="stat">
              <div className="value">{items.filter((i) => i.type === "file").length}</div>
              <div className="label">Files</div>
            </div>
          </div>
        </section>

        <section className="grid">
          {filtered.length === 0 ? (
            <div className="empty">No items yet — click “Add to Locker” to add something.</div>
          ) : (
            filtered.map((item) => (
              <article className="card item-card" key={item.id}>
                <div className="card-head">
                  <strong>{item.title || (item.type === "note" ? "Note" : "File")}</strong>
                  <span className="ts">{item.created_at ? new Date(item.created_at).toLocaleString() : ""}</span>
                </div>

                <div className="card-body">
                  {item.type === "note" ? (
                    <p className="note-preview">{item.content}</p>
                  ) : (
                    <>
                      {item.mime && item.mime.startsWith("image") ? (
                        <img className="thumb" src={API.defaults.baseURL + item.file_path} alt={item.title} />
                      ) : (
                        <div className="file-block">
                          <svg width="36" height="36" viewBox="0 0 24 24"><path fill="#2563eb" d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/></svg>
                          <div className="file-meta">
                            <div className="fname">{item.title || "Document"}</div>
                            <a className="open" href={API.defaults.baseURL + item.file_path} target="_blank" rel="noreferrer">Open</a>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      {showAdd && (
        <AddModal
          onClose={() => setShowAdd(false)}
          onAdded={onAdded}
          userId={userId}
        />
      )}
    </>
  );
}

/* AddModal Component - kept inside this file for simplicity */
function AddModal({ onClose, onAdded, userId }) {
  const [mode, setMode] = useState("note"); // "note" or "file"
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      if (mode === "note") {
        const res = await API.post(`/locker/${userId}`, { title, content });
        if (res.data && res.data.success) {
          onAdded(res.data.item);
          onClose();
        } else {
          alert(res.data?.error || "Failed to add note");
        }
      } else {
        if (!file) {
          alert("Choose a file");
          setLoading(false);
          return;
        }
        const fd = new FormData();
        fd.append("file", file);
        if (title) fd.append("title", title);
        const res = await API.post(`/locker/${userId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data && res.data.success) {
          onAdded(res.data.item);
          onClose();
        } else {
          alert(res.data?.error || "Failed to upload file");
        }
      }
    } catch (err) {
      console.error("add item error", err);
      alert("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <div className="modal-head">
          <h3>Add to Locker</h3>
          <div className="mode-switch">
            <button type="button" className={mode==="note" ? "active" : ""} onClick={()=>setMode("note")}>Note</button>
            <button type="button" className={mode==="file" ? "active" : ""} onClick={()=>setMode("file")}>Photo / File</button>
          </div>
        </div>

        <form className="modal-body" onSubmit={submit}>
          <input placeholder="Name / Title (optional)" value={title} onChange={e=>setTitle(e.target.value)} />
          {mode === "note" ? (
            <textarea placeholder="Write your note..." value={content} onChange={e=>setContent(e.target.value)} />
          ) : (
            <>
              <input type="file" accept="image/*,.pdf" onChange={e=>setFile(e.target.files[0])} />
            </>
          )}

          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary" disabled={loading}>{loading ? "Adding..." : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
