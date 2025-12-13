// src/api.js
export const API_BASE = "https://flask-backend-x750.onrender.com";

// unified response parser
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

  const config = {
    method,
    headers: {
      Accept: "application/json",
      ...(opts.headers || {})
    },
    ...opts
  };

  // IMPORTANT: never set Content-Type manually for FormData
  if (body !== null) {
    if (body instanceof FormData) {
      config.body = body;
    } else {
      config.headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(body);
    }
  }

  const res = await fetch(url, config);
  const data = await parseResponse(res);

  return {
    ok: res.ok,
    status: res.status,
    ...data
  };
}

const API = {
  defaults: { baseURL: API_BASE },
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  delete: (path) => request("DELETE", path),
};

export default API;
