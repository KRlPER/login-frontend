// src/lib/api.js
// Central API module using fetch under the hood but exposing an axios-like API
// so existing frontend code that calls `API.post(...)` or reads `API.defaults.baseURL` works.
//
// IMPORTANT:
// - Set API_BASE to your backend URL (local dev: http://127.0.0.1:5000, production: https://your-backend.onrender.com)
// - If you put this file at src/api.js adjust your imports accordingly; otherwise import from "../lib/api"

export const API_BASE = "https://flask-backend-x750.onrender.com"; // <- change this to your deployed backend (https://...) for production

async function parseResponse(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

/**
 * Generic request helper (fetch)
 * method: "GET" | "POST" | "PUT" | "DELETE"
 * path: string (e.g. "/register")
 * body: JS object (will be JSON.stringified) or FormData (for multipart)
 * opts: additional fetch options (headers, credentials, etc)
 */
export async function request(method, path, body = null, opts = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    Accept: "application/json",
    // Content-Type is set below only when appropriate
    ...(opts.headers || {}),
  };

  const config = {
    method,
    headers,
    ...opts,
  };

  // If body is FormData, do NOT set Content-Type (browser will set multipart boundary)
  if (body !== null) {
    if (body instanceof FormData) {
      config.body = body;
      // ensure Content-Type is not set for FormData
      if (config.headers["Content-Type"]) delete config.headers["Content-Type"];
    } else {
      config.body = JSON.stringify(body);
      config.headers["Content-Type"] = "application/json";
    }
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

/* --- Convenience API functions (your app may call these) --- */
export async function registerUser(payload) {
  // path: "/register" (adjust if your backend uses /api/register)
  return await request("POST", "/register", payload);
}

export async function loginUser(payload) {
  return await request("POST", "/login", payload);
}

export async function getProfile(userId) {
  // if your backend returns /profile/:userId
  return await request("GET", `/profile/${userId}`);
}

/* --- Add helper wrappers so API.post(...) style works --- */
const API = {
  // base URL (used by UI, e.g. to build image URLs)
  defaults: {
    baseURL: API_BASE,
  },

  // low-level helpers
  request,
  registerUser,
  loginUser,
  getProfile,

  // axios-like shortcuts that frontend code expects
  get: async (path, opts = {}) => {
    return await request("GET", path, null, opts);
  },
  post: async (path, body = null, opts = {}) => {
    // allow body to be FormData or plain object
    return await request("POST", path, body, opts);
  },
  put: async (path, body = null, opts = {}) => {
    return await request("PUT", path, body, opts);
  },
  delete: async (path, body = null, opts = {}) => {
    // some backends accept body with DELETE, others don't — supports both
    return await request("DELETE", path, body, opts);
  },

  // expose API_BASE constant for convenience
  API_BASE,
};

export default API;
