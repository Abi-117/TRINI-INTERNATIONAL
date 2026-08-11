import axios from "axios";

const API = "http://localhost:5000/api/products";

const getAdminToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken");
};

export const productService = {
  // Shop Page
  listProducts: async (query?: any) => {
    const res = await axios.get(API, {
      params: query,
    });

    return {
      items: res.data.products,
      total: res.data.total,
      page: res.data.page,
      totalPages: res.data.totalPages,
    };
  },

  // Product Details
  getProduct: async (slug: string) => {
    const res = await axios.get(`${API}/${slug}`);
    return res.data.product;
  },

  // Admin - Get product by ID
  getAdminProduct: async (id: string) => {
    const token = getAdminToken();

    const res = await axios.get(`${API}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.product;
  },

  // Admin - Create
  create: async (data: FormData) => {
    const token = getAdminToken();

    const res = await axios.post(API, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  // Admin - Update
  update: async (id: string, data: FormData) => {
    const token = getAdminToken();

    const res = await axios.put(`${API}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  // Admin - Delete
  delete: async (id: string) => {
    const token = getAdminToken();

    const res = await axios.delete(`${API}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  },
};