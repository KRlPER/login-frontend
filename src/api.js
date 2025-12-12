// src/api.js
// Works like axios but uses fetch internally

export const API_BASE = "https://flask-backend-x750.onrender.com";

async function parseResponse(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function request(method, path, body = null, opts = {}) {
  const url = `${API_BASE}${path}`;

  const headers = { ...(opts.headers || {}) };

  const config = { method, headers, ...opts };

  if (body instanceof FormData) {
    config.body = body;
  } else if (body !== null) {
    headers["Content-Type"] = "application/json";
    config.body = JSON.stringify(body);
  }

  const res = await fetch(url, config);
  const data = await parseResponse(res);

  if (!res.ok) {
    const err = new Error(data?.error || data?.message || "Request failed");
    err.status = res.status;
    err.response = data;
    throw err;
  }

  return { status: res.status, data };
}

const API = {
  defaults: { baseURL: API_BASE },

  get: (path, opts) => request("GET", path, null, opts),
  post: (path, body, opts) => request("POST", path, body, opts),
  put: (path, body, opts) => request("PUT", path, body, opts),
  delete: (path, body, opts) => request("DELETE", path, body, opts),
};

export default API;
