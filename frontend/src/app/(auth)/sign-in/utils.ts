/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/shared/common";
import { validateInputs, authBasicAPI, ENDPOINTS } from "@/shared/allUtils";

export const validateLogInInputs = (state: typeof initialState) => {
  const emailFeedback = validateInputs(state.email, "email");
  const passwordFeedback = validateInputs(state.password, "password");
  return { emailFeedback, passwordFeedback };
};

export const handleLogIn = async (
  state: typeof initialState,
  dispatch: any,
  router: any
) => {
  dispatch({ type: "SET_LOADING", value: true });
  dispatch({ type: "SET_ERROR", value: null });
  dispatch({
    type: "SET_FEEDBACK",
    feedback: {
      emailFeedback: null,
      passwordFeedback: null,
    },
  });

  try {
    const payload = { email: state.email, password: state.password };
    const response = await authBasicAPI.post(ENDPOINTS.LOGIN, payload);
    if (response.status === 200) {
      router.push("/dashboard");
      toast.success("Welcome back!");
    }
  } catch (error: any) {
    if (error.response.status === 401)
      toast.error("Invalid credentials. Try again!");
    switch (error.response?.data?.detail[0]) {
      case "Email is not verified.":
        toast.warning("Email is not verified. Redirecting...");
        router.push(`/verification?email=${encodeURIComponent(state.email)}`);
        break;
      case "Invalid credentials.":
        toast.error("Invalid credentials. Try again!");
        break;
      default:
        dispatch({ type: "SET_ERROR", value: "Login failed!" });
        break;
    }
  } finally {
    dispatch({ type: "SET_LOADING", value: false });
  }
};

// Reducer function to manage state updates
export const initialState = {
  email: "",
  password: "",
  emailFeedback: null,
  passwordFeedback: null,
  rememberMe: true,
  isLoading: false,
  error: null,
};

export type LogInAction =
  | { type: "SET_FIELD"; field: string; value: string }
  | {
      type: "SET_FEEDBACK";
      feedback: {
        emailFeedback: any;
        passwordFeedback: any;
      };
    }
  | {
      type: "SET_USER_TYPE";
      value: "benefactor" | "beneficiary" | "organisation";
    }
  | { type: "SET_REMEMBER" }
  | { type: "SET_LOADING"; value: boolean }
  | { type: "SET_ERROR"; value: string | null }
  | { type: "RESET" };

export const logInReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_USER_TYPE":
      return { ...state, userType: action.value };
    case "SET_FEEDBACK":
      return { ...state, ...action.feedback };
    case "SET_REMEMBER":
      return { ...state, rememberMe: !state.rememberMe };
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
