/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ENDPOINTS } from "./endpoints";
import { axios, toast } from "@/shared/common";

export const publicAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export const authBasicAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const authAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

authAPI.interceptors.response.use(
  (response: any) => {
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;
    // console.log("authAPI's error:", error);
    // if (error.response.status === 429)
    //   toast.error(
    //     "There are security concerns on your account. Please try again later or contact us at qurbaan.ng@gmail.com"
    //   );
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // console.log("Attempting token refresh");
        await authAPI.post(ENDPOINTS.REFRESH);
        // console.log("refreshed successfully");
        return authAPI(originalRequest);
      } catch (err) {
        // console.error("Refresh failed:", err);
        window.location.href = "/sign-in";
      }
    }
    return Promise.reject(error);
  }
);
