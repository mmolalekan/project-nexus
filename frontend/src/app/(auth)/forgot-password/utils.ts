/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/shared/common";
import { publicAPI, validateInputs, ENDPOINTS } from "@/shared/allUtils";

export const validatePasswordInputs = (email: string) => {
  const emailFeedback = validateInputs(email, "email");
  return { emailFeedback };
};

export const handleForgotPassword = async (email: string, dispatch?: any) => {
  dispatch({ type: "SET_LOADING", value: true });
  dispatch({ type: "SET_ERROR", value: null });
  dispatch({
    type: "SET_FEEDBACK",
    feedback: { emailFeedback: null },
  });
  const payload = { email };

  try {
    await publicAPI.post(ENDPOINTS.FORGOT_PASSWORD, payload);
    toast.success("Password reset link has been sent to your email.");
    dispatch({ type: "SET_VERIFY" });
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 400 || error.response.status === 404)
        toast.error("Sure you have an account? Try signing up again.");
      else toast.error("Password-reset request failed. Check your internet");
    } else {
      toast.error("Password-reset request failed. Check your internet");
    }
  } finally {
    dispatch({ type: "SET_LOADING", value: false });
  }
};

export const initialState = {
  email: "",
  emailFeedback: null,
  verified: false,
  isLoading: false,
  error: null,
};

export type ForgotPasswordAction =
  | { type: "SET_FIELD"; field: string; value: string }
  | {
      type: "SET_FEEDBACK";
      feedback: { emailFeedback: any };
    }
  | { type: "SET_VERIFY" }
  | { type: "SET_LOADING"; value: boolean }
  | { type: "SET_ERROR"; value: string | null }
  | { type: "RESET" };

export const ForgotPasswordReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_FEEDBACK":
      return { ...state, ...action.feedback };
    case "SET_VERIFY":
      return { ...state, verified: true };
    case "SET_LOADING":
      return { ...state, isLoading: action.value };
    case "SET_ERROR":
      return { ...state, error: action.value };
    case "RESET":
      return initialState;
    default:
      throw new Error("Unknown action type");
  }
};
