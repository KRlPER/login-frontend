// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://your-flask-backend.onrender.com", // <-- REPLACE with your Render backend URL
});

export default API;
