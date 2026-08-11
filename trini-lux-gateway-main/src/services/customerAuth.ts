import api from "./api";

export interface CustomerSignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface CustomerLoginData {
  email: string;
  password: string;
}

export const signupCustomer = async (
  data: CustomerSignupData
) => {
  const response = await api.post(
    "/customer/signup",
    data
  );

  return response.data;
};

export const loginCustomer = async (
  data: CustomerLoginData
) => {
  const response = await api.post(
    "/customer/login",
    data
  );

  return response.data;
};

export const getCustomerProfile = async (
  token: string
) => {
  const response = await api.get(
    "/customer/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateCustomerProfile = async (
  token: string,
  data: {
    name: string;
    phone: string;
  }
) => {
  const response = await api.put(
    "/customer/profile",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};