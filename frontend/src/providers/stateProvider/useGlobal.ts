/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ModalKeys, UserProfile } from "./type";
import { toast } from "@/shared/common";
import { useGlobalState } from "./provider";
import { authAPI, ENDPOINTS } from "@/shared/allUtils";

export const useGlobalActions = () => {
  const { globalDispatch } = useGlobalState();

  const getProfile = async () => {
    globalDispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await authAPI.get(ENDPOINTS.GET_PROFILE);
      // console.log("profile: ", response.data.data);
      globalDispatch({ type: "SET_PROFILE", payload: response.data.data });
    } catch (err: any) {
      // console.error("Error fetching profile:", err);
      toast.error("Error fetching profile");
    } finally {
      globalDispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateProfile = async (
    updates: Partial<UserProfile>,
    field: ModalKeys
  ) => {
    globalDispatch({ type: "SET_LOADING", payload: true });
    // console.log("updates: ", updates);
    try {
      const response = await authAPI.put(ENDPOINTS.UPDATE_PROFILE, updates);
      toast.success("Profile updated successfully");
      // console.log("profile: ", response.data.data);
      globalDispatch({ type: "SET_PROFILE", payload: response.data.data });
      globalDispatch({ type: "TOGGLE_MODAL", field }); //close modal
    } catch (err: any) {
      // console.error("Error fetching profile:", err);
      toast.error("Error fetching profile");
    } finally {
      globalDispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const getBookingSummary = async () => {
    globalDispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await authAPI.get(ENDPOINTS.GET_BOOKING_SUMMARY);
      // console.log("All bookings: ", response.data);
      globalDispatch({ type: "SET_BOOKING_SUMMARY", payload: response.data });
    } catch (err: any) {
      // console.error("Error fetching bookings:", err);
      toast.error("Error fetching bookings");
    } finally {
      globalDispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const getMyBookings = async () => {
    globalDispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await authAPI.get(ENDPOINTS.GET_MY_BOOKINGS);
      // console.log("My bookings: ", response.data);
      globalDispatch({ type: "SET_MY_BOOKINGS", payload: response.data });
    } catch (err: any) {
      // console.error("Error fetching my bookings:", err);
      toast.error("Error fetching my bookings");
    } finally {
      globalDispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return { getProfile, updateProfile, getBookingSummary, getMyBookings };
};
