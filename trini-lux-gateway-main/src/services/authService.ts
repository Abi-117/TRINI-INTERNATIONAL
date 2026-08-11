import api from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export const loginAdmin = async (data: LoginData) => {
  const response = await api.post("/admin/login", data);
  return response.data;
};

export const getAdminProfile = async (token: string) => {
  const response = await api.get("/admin/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
