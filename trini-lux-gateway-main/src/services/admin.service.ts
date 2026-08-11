import { apiClient } from "./api/client";
import { endpoints } from "./api/endpoints";
import api from "./api";
import axios from "axios";

/**
 * Admin-ready API surface. These call straight through to your backend —
 * no mock fallbacks, since the admin panel is expected to run against a real
 * Node/Express + MongoDB API.
 */
export const adminService = {
  dashboard: async () => (await apiClient.get(endpoints.admin.dashboard)).data,
  analytics: async (params?: Record<string, unknown>) =>
    (await apiClient.get(endpoints.admin.analytics, { params })).data,

  products: {
    list: async (params?: Record<string, unknown>) =>
      (await apiClient.get(endpoints.admin.products, { params })).data,
    create: async (body: unknown) => (await apiClient.post(endpoints.admin.products, body)).data,
    update: async (id: string, body: unknown) =>
      (await apiClient.put(endpoints.admin.product(id), body)).data,
    remove: async (id: string) => (await apiClient.delete(endpoints.admin.product(id))).data,
  },
  categories: {
    list: async () => (await apiClient.get(endpoints.admin.categories)).data,
    create: async (body: unknown) => (await apiClient.post(endpoints.admin.categories, body)).data,
  },
  orders: {
    list: async (params?: Record<string, unknown>) =>
      (await apiClient.get(endpoints.admin.orders, { params })).data,
    update: async (id: string, body: unknown) =>
      (await apiClient.put(endpoints.admin.order(id), body)).data,
  },
  users: {
    list: async (params?: Record<string, unknown>) =>
      (await apiClient.get(endpoints.admin.users, { params })).data,
  },
  coupons: {
    list: async () => (await apiClient.get(endpoints.admin.coupons)).data,
    create: async (body: unknown) => (await apiClient.post(endpoints.admin.coupons, body)).data,
  },
  reviews: {
    list: async () => (await apiClient.get(endpoints.admin.reviews)).data,
  },
  banners: {
    list: async () => (await apiClient.get(endpoints.admin.banners)).data,
    create: async (body: unknown) => (await apiClient.post(endpoints.admin.banners, body)).data,
  },
  offers: {
    list: async () => (await apiClient.get(endpoints.admin.offers)).data,
    create: async (body: unknown) => (await apiClient.post(endpoints.admin.offers, body)).data,
  },
};
//--------------------------------------------------
// ORDERS
//--------------------------------------------------

export const getOrder = async (
  id: string,
  token: string
) => {
  const response = await api.get(
    `/customer/orders/admin/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


export const getDashboard = async (token: string) => {
  const res = await api.get("/admin/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getOrderDetails = async (
  id: string,
  token: string
) => {
  const res = await api.get(
    `/admin/orders/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const downloadInvoice = (
  id: string,
  token: string
) => {
  return api.get(
    `/admin/orders/${id}/invoice`,
    {
      responseType: "blob",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const getCancelRequests = async (
  token: string
) => {
  const res = await api.get(
    "/admin/cancel-requests",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getReturnRequests = async (
  token: string
) => {
  const res = await api.get(
    "/admin/return-requests",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const updateCancelRequest = async (
  id: string,
  status: string,
  token: string
) => {
  const res = await api.put(
    `/admin/orders/${id}/cancel-status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const updateReturnRequest = async (
  id: string,
  status: string,
  token: string
) => {
  const res = await api.put(
    `/admin/orders/${id}/return-status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getAllCustomers = async (
  token: string
) => {
  const res = await axios.get(
    "http://localhost:5000/api/customer/admin/all",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getOrderById = async (
  id: string,
  token: string
) => {
  const res = await api.get(
    `/customer/orders/admin/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};


export const getAllOrders = async (token: string) => {
  const res = await api.get(
    "/customer/orders/admin/all",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getAdminOrder = async (
  id: string,
  token: string
) => {
  const res = await api.get(
    `/customer/orders/admin/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const updateOrderStatus = async (
  id: string,
  status: string,
  token: string
) => {
  const res = await api.put(
    `/customer/orders/admin/${id}`,
    {
      orderStatus: status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const updateShipment = async (
  id: string,
  data: {
    trackingNumber: string;
    courier: string;
    dispatchDate?: string;
    expectedDelivery?: string;
  },
  token: string
) => {
  const res = await api.put(
    `/customer/orders/admin/orders/${id}/shipment`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};