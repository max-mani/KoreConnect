import axios from "axios";

const instance = axios.create({
  baseURL: "https://koreconnect.onrender.com", // Backend API URL
});

export default instance;
