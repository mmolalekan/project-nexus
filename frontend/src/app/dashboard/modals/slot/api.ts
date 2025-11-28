/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/shared/common";
import { Booking, BookingAction } from "./type";
import { authAPI, ENDPOINTS } from "@/shared/allUtils";

export const isReferrerValid = async (
  referral_code: string | null,
  dispatch: React.Dispatch<BookingAction>
) => {
  dispatch({ type: "SET_LOADING", payload: true });
  dispatch({ type: "SET_ERROR", payload: null });
  dispatch({ type: "SET_FIELD", field: "referrer", payload: null });
  const payload = { referral_code: referral_code?.toUpperCase() || "" };
  try {
    const response = await authAPI.post(ENDPOINTS.IS_REFERRER_VALID, payload);
    dispatch({ type: "SET_FIELD", field: "referrer", payload: response.data });
  } catch (err: any) {
    dispatch({ type: "SET_FIELD", field: "referral_code", payload: "" });
    if (err.response) {
      if (err.response.data)
        toast.warning(err.response.data.error || "Referral code is invalid");
    } else toast.error("We could not verify the referral code");
  } finally {
    dispatch({ type: "SET_LOADING", payload: false });
  }
};

export const bookSlot = async (
  state: Booking,
  dispatch: React.Dispatch<BookingAction>
) => {
  dispatch({ type: "SET_LOADING", payload: true });
  dispatch({ type: "SET_ERROR", payload: null });
  const payload = {
    package_type: state.package_type,
    delivery_option: state.delivery_option ? "delivery" : "pickup",
    slots: state.slots,
    referral_code: state.referral_code.toUpperCase(),
  };

  try {
    const res = await authAPI.post(ENDPOINTS.BOOK_SLOT, payload);
    // console.log(res.data);
    if (res.data.payment_link) {
      window.location.href = res.data.payment_link;
    } else {
      toast.error("Error initiating payment.");
      // console.log(res.data);
    }
    toast.success("Booked successfully!");
  } catch (err: any) {
    if (err.response) {
      if (err.response.data)
        toast.error(
          err.response.data.error ||
            "Booking failed. Ensure all fields are filled correctly."
        );
    } else toast.error("Booking failed. Pls try again!");
  } finally {
    dispatch({ type: "SET_LOADING", payload: false });
  }
};
