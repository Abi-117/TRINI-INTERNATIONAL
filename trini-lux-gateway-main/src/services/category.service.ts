import axios from "axios";

const API = "https://trini-international.onrender.com/api/categories";

export const categoryService = {
  async getAll() {
    const res = await axios.get(API);
    return res.data.categories;
  },
};