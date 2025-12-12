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

/**
 * Generic request helper
 * method: "GET" | "POST" | "PUT" | "DELETE"
 * path: string (e.g. "/api/register")
 * body: JS object (will be JSON.stringified) or null
 * opts: additional fetch options (headers, credentials, etc)
 */
export async function request(method, path, body = null, opts = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(opts.headers || {})
  };

  const config = {
    method,
    headers,
    ...opts
  };

  if (body !== null) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(url, config);
  const data = await parseResponse(res);

  if (!res.ok) {
    const err = new Error(data?.message || `Request failed: ${res.status}`);
    err.status = res.status;
    err.response = data;
    throw err;
  }

  return data;
}

// Example API functions (extend as needed)
export async function registerUser(payload) {
  try {
    return await request("POST", "/api/register", payload);
  } catch (err) {
    console.error("registerUser error:", err);
    throw err;
  }
}

export async function loginUser(payload) {
  try {
    return await request("POST", "/api/login", payload);
  } catch (err) {
    console.error("loginUser error:", err);
    throw err;
  }
}

export async function getProfile() {
  try {
    return await request("GET", "/api/profile");
  } catch (err) {
    console.error("getProfile error:", err);
    throw err;
  }
}

// Default export so older code using `import API from '.../api'` still works
const API = {
  API_BASE,
  request,
  registerUser,
  loginUser,
  getProfile
};

export default API;
