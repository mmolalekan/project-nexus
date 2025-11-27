/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/shared/common";
import { publicAPI, validateInputs, ENDPOINTS } from "@/shared/allUtils";

export const validatePWDInputs = (state: typeof initialState) => {
  const passwordFeedback = validateInputs(state.password, "password");
  const confirmPasswordFeedback = validateInputs(
    state.password,
    "password2",
    state.password2
  );
  return { passwordFeedback, confirmPasswordFeedback };
};

export const handleResetPassword = async (
  uidb64: string | null,
  token: string | null,
  password: string,
  dispatch: any
) => {
  dispatch({ type: "SET_LOADING", value: true });
  dispatch({ type: "SET_ERROR", value: null });
  dispatch({
    type: "SET_FEEDBACK",
    feedback: {
      passwordFeedback: null,
      confirmPasswordFeedback: null,
    },
  });
  const payload = { uidb64, token, new_password: password };

  try {
    await publicAPI.post(ENDPOINTS.RESET_PASSWORD, payload);
    toast.success("Password has been reset successfully.");
  } catch (error: any) {
    if (error.response) {
      toast.error("Invalid reset link");
    } else {
      dispatch({ type: "SET_ERROR", value: "Failed to reset password" });
    }
  } finally {
    dispatch({ type: "SET_LOADING", value: false });
  }
};

export const initialState = {
  password: "",
  password2: "",
  passwordFeedback: null,
  confirmPasswordFeedback: null,
  isLoading: false,
  error: null,
};

export type PWDResetAction =
  | { type: "SET_FIELD"; field: string; value: string }
  | {
      type: "SET_FEEDBACK";
      feedback: {
        passwordFeedback: any;
        confirmPasswordFeedback: any;
      };
    }
  | { type: "SET_LOADING"; value: boolean }
  | { type: "SET_ERROR"; value: string | null }
  | { type: "RESET" };

export const PWDResetReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_FEEDBACK":
      return { ...state, ...action.feedback };
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
