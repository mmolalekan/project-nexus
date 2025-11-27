/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { authAPI, ENDPOINTS } from "../allUtils";

export const logout = async (): Promise<void> => {
  try {
    await authAPI.post(ENDPOINTS.LOGOUT);
  } catch (error) {
    // console.error("Error during logout:", error);
  } finally {
    window.location.href = "/sign-in";
  }
};

export const isLoggedIn = async (): Promise<boolean> => {
  try {
    // Attempt to fetch the user's profile
    const response = await authAPI.post(ENDPOINTS.IS_LOGGED_IN);
    if (response.status === 200) {
      // console.log("Access token is still valid");
      return true;
    }
  } catch (error: any) {
    // If the error status is 401, attempt to refresh the token
    if (error.response?.status === 401) {
      try {
        const refreshResponse = await authAPI.post(ENDPOINTS.REFRESH);
        if (refreshResponse.status === 200) {
          // console.log("Token successfully refreshed.");
          return true;
        }
      } catch (refreshError: any) {
        // console.error("Refresh failed:", refreshError.response || refreshError);
        return false;
      }
    }
    // console.error("Error checkingstatus:", error.response || error);
    return false;
  }

  return false; // Catch-all fallback
};
