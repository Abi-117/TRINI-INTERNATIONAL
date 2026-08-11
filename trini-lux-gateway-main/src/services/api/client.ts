import axios, { type AxiosInstance, type AxiosError } from "axios";

/**
 * Central Axios instance.
 *
 * Point this at your Node/Express backend by setting `VITE_API_BASE_URL`.
 * While it is unset, the service layer transparently resolves data from the
 * bundled catalog fixtures so the UI stays fully functional.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
export const USE_MOCK = !API_BASE_URL;

export const TOKEN_STORAGE_KEY = "trini.auth.token";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL || "/api",
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ?? error.message ?? "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

/** Simulated latency so loading states are realistic while mocked. */
export const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export async function request<T>(fn: () => Promise<T>, mock: () => Promise<T> | T): Promise<T> {
  if (USE_MOCK) {
    await delay();
    return mock();
  }
  return fn();
}
