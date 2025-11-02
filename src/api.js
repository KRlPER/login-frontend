// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://flask-backend-x750.onrender.com", // your deployed backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
