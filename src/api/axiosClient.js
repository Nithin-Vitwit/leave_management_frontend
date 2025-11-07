import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE || "http://localhost:8080";

const client = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token if present
client.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("hr_token");
  if (token) {
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

export default client;
