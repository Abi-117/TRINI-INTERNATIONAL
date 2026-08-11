import api from "./api";

export interface SignupCustomerData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginCustomerData {
  email: string;
  password: string;
}

/* =========================
   CUSTOMER SIGNUP
========================= */

export const signupCustomer = async (
  data: SignupCustomerData
) => {
  const res = await api.post(
    "/customer/auth/signup",
    data
  );

  return res.data;
};

/* =========================
   CUSTOMER LOGIN
========================= */

export const loginCustomer = async (
  data: LoginCustomerData
) => {
  const res = await api.post(
    "/customer/auth/login",
    data
  );

  return res.data;
};

/* =========================
   CUSTOMER PROFILE
========================= */

export const getCustomerProfile = async (
  token: string
) => {
  const res = await api.get(
    "/customer/auth/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

/* =========================
   FORGOT PASSWORD
========================= */

export const forgotPassword = async (
  email: string
) => {
  const res = await api.post(
    "/customer/auth/forgot-password",
    {
      email,
    }
  );

  return res.data;
};

/* =========================
   VERIFY OTP
========================= */

export const verifyOTP = async (
  email: string,
  otp: string
) => {
  const res = await api.post(
    "/customer/auth/verify-otp",
    {
      email,
      otp,
    }
  );

  return res.data;
};

/* =========================
   RESET PASSWORD
========================= */

export const resetPassword = async (
  email: string,
  otp: string,
  password: string
) => {
  const res = await api.post(
    "/customer/auth/reset-password",
    {
      email,
      otp,
      password,
    }
  );

  return res.data;
};