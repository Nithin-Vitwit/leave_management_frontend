import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE || "https://1gpz056f-8080.inc1.devtunnels.ms";

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
