import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000", // Backend API URL
});

export default instance;
