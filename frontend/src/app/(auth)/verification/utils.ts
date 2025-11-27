/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/shared/common";
import { startCountdown } from "../utils";
import { publicAPI, ENDPOINTS } from "@/shared/allUtils";

export const handleVerifyCode = async (
  email: string | null,
  value: string,
  dispatch: React.Dispatch<verificationAction>
) => {
  dispatch({ type: "SET_LOADING", value: true });
  dispatch({ type: "SET_ERROR", value: null });

  const payload = { email, verification_code: value };

  try {
    await publicAPI.post(ENDPOINTS.VERIFY_EMAIL, payload);
    dispatch({ type: "SET_VERIFY", value: true });
  } catch (err: any) {
    if (err.response) {
      switch (err.response.data.detail) {
        case "Verification code has expired.":
          toast.error("Verification code has expired. Resend code");
          break;
        case "Invalid verification code.":
          toast.error("Invalid code. Check your email for the correct code.");
          break;
        case "User with this email does not exist.":
          toast.error("Sure you have an account? Try signing up again.");
          break;
        default:
          toast.error("Failed to verify account");
      }
    } else toast.error("Ensure you are connected to the internet");
  } finally {
    dispatch({ type: "SET_LOADING", value: false });
  }
};

export const handleResendCode = async (
  email: string | null,
  dispatch: React.Dispatch<verificationAction>
) => {
  dispatch({ type: "SET_LOADING", value: true });
  dispatch({ type: "SET_ERROR", value: null });
  const payload = { email };

  try {
    await publicAPI.post(ENDPOINTS.RESEND_CODE, payload);
    startCountdown(dispatch, 71);
  } catch (err: any) {
    if (err.response) {
      switch (err.response.data.detail) {
        case "User with this email does not exist.":
          toast.error("Sure you have an account? Try signing up again.");
          break;
        case "Email is already verified.":
          toast.success("Email is already verified. Sign in to proceed.");
          break;
        default:
          toast.error("Failed to resend code");
      }
    } else toast.error("Ensure you are connected to the internet");
  } finally {
    dispatch({ type: "SET_LOADING", value: false });
  }
};

export interface VerificationState {
  value: "";
  countdown: number | null;
  verified: boolean;
  isLoading: boolean;
  error: string | null;
}

// State Management
export const initialState: VerificationState = {
  value: "",
  countdown: null,
  verified: false,
  isLoading: false,
  error: null,
};

export type verificationAction =
  | { type: "SET_FIELD"; field: keyof VerificationState; value: any }
  | { type: "SET_COUNTDOWN"; value: number | null }
  | { type: "SET_VERIFY"; value: boolean }
  | { type: "SET_LOADING"; value: boolean }
  | { type: "SET_ERROR"; value: string | null }
  | { type: "RESET" };

export const verificationReducer = (
  state: VerificationState,
  action: verificationAction
): VerificationState => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_COUNTDOWN":
      return { ...state, countdown: action.value };
    case "SET_LOADING":
      return { ...state, isLoading: action.value };
    case "SET_VERIFY":
      return { ...state, verified: action.value };
    case "SET_ERROR":
      return { ...state, error: action.value };
    case "RESET":
      return initialState;
    default:
      throw new Error("Unknown action type");
  }
};
