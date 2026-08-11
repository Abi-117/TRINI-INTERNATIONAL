import axios from "axios";

const api = axios.create({
  baseURL: "https://trini-international.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;