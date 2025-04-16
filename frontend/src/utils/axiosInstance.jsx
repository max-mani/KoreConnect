import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://koreconnect.onrender.com", // Use environment variable or fallback
  withCredentials: true, // Important for cookies/auth
});

export default instance;
