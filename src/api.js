// src/lib/api.js
// central place for API requests — update API_BASE to your deployed backend URL
export const API_BASE = "https://your-render-backend.onrender.com"; // <- CHANGE THIS

async function parseResponse(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function registerUser(payload) {
  try {
    const res = await fetch(`${API_BASE}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      // credentials: 'include' // uncomment only if your backend uses cookies
    });

    const data = await parseResponse(res);

    if (!res.ok) {
      const err = new Error(data?.message || `Request failed: ${res.status}`);
      err.status = res.status;
      err.response = data;
      throw err;
    }

    return data;
  } catch (err) {
    // keep error informative for frontend
    console.error("registerUser error:", err);
    throw err;
  }
}
