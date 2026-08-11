import { apiClient } from "./api/client";
import api from "./api";

export const reviewService = {
  // Get Reviews
  getReviews: async (slug: string) => {
    const res = await apiClient.get(`/reviews/${slug}`);
    return res.data;
  },

  // Add Review
  addReview: async (data: any) => {
    const res = await apiClient.post("/reviews", data);
    return res.data;
  },

  // Helpful
  likeReview: async (id: string) => {
    const res = await apiClient.put(`/reviews/like/${id}`);
    return res.data;
  },
};

export const getAllReviews = async (token: string) => {
  const res = await api.get("/reviews/admin/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const approveReview = async (
  id: string,
  token: string
) => {
  const res = await api.put(
    `/reviews/admin/approve/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const rejectReview = async (
  id: string,
  token: string
) => {
  const res = await api.put(
    `/reviews/admin/reject/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};