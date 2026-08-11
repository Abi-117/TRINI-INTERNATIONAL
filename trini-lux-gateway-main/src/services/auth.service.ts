import {
  apiClient,
  request,
  TOKEN_STORAGE_KEY,
} from "./api/client";

import { endpoints } from "./api/endpoints";
import type { AuthSession, User } from "@/types";

const mockUser = (
  email: string,
  name?: string
): User => ({
  id: "u_demo",

  name:
    name ??
    email
      .split("@")[0]
      .replace(/\b\w/g, (c) =>
        c.toUpperCase()
      ),

  email,

  phone: "+91 90000 00000",
});

export const authService = {
  /* =========================================
     LOGIN
  ========================================= */

  login: (payload: {
    email: string;
    password: string;
  }) =>
    request<AuthSession>(
      async () =>
        (
          await apiClient.post(
            endpoints.auth.login,
            payload
          )
        ).data,

      () => ({
        user: mockUser(payload.email),
        token: "demo.jwt.token",
      })
    ),

  /* =========================================
     SIGNUP
  ========================================= */

  signup: (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) =>
    request<AuthSession>(
      async () =>
        (
          await apiClient.post(
            endpoints.auth.signup,
            payload
          )
        ).data,

      () => ({
        user: {
          ...mockUser(
            payload.email,
            payload.name
          ),
          phone: payload.phone,
        },

        token: "demo.jwt.token",
      })
    ),

  /* =========================================
     PHONE OTP
  ========================================= */

  sendOtp: (phone: string) =>
    request<{ message: string }>(
      async () =>
        (
          await apiClient.post(
            endpoints.auth.sendOtp,
            {
              phone,
            }
          )
        ).data,

      () => ({
        message: `OTP sent to ${phone}`,
      })
    ),

  /* =========================================
     VERIFY PHONE OTP
  ========================================= */

  verifyOtp: (payload: {
    phone: string;
    otp: string;
  }) =>
    request<AuthSession>(
      async () =>
        (
          await apiClient.post(
            endpoints.auth.verifyOtp,
            payload
          )
        ).data,

      () => ({
        user: mockUser(
          "member@trini.in",
          "Trini Member"
        ),

        token: "demo.jwt.token",
      })
    ),

  /* =========================================
     LOGOUT
  ========================================= */

  logout: () => {
    if (
      typeof window !== "undefined"
    ) {
      window.localStorage.removeItem(
        TOKEN_STORAGE_KEY
      );
    }

    return request<{ ok: true }>(
      async () =>
        (
          await apiClient.post(
            endpoints.auth.logout
          )
        ).data,

      () =>
        ({
          ok: true,
        }) as const
    );
  },

  /* =========================================
     FORGOT PASSWORD
     SEND EMAIL OTP
  ========================================= */

  forgotPassword: async (
    email: string
  ) => {
    const { data } =
      await apiClient.post(
        "/customer/auth/forgot-password",
        {
          email: email
            .toLowerCase()
            .trim(),
        }
      );

    return data;
  },

  /* =========================================
     VERIFY EMAIL OTP
  ========================================= */

  verifyOTP: async (
    email: string,
    otp: string
  ) => {
    const { data } =
      await apiClient.post(
        "/customer/auth/verify-otp",
        {
          email: email
            .toLowerCase()
            .trim(),

          otp: otp.trim(),
        }
      );

    return data;
  },

  /* =========================================
     RESET PASSWORD
  ========================================= */

  resetPassword: async (
    email: string,
    otp: string,
    password: string
  ) => {
    const { data } =
      await apiClient.post(
        "/customer/auth/reset-password",
        {
          email: email
            .toLowerCase()
            .trim(),

          otp: otp.trim(),

          password,
        }
      );

    return data;
  },
};