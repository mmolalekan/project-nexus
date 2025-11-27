/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/shared/common";
import { validateInputs, publicAPI, ENDPOINTS } from "@/shared/allUtils";

export const validateSignUpInputs = (state: typeof initialState) => {
  const firstNameFeedback = validateInputs(state.firstName, "name");
  const lastNameFeedback = validateInputs(state.lastName, "name");
  const emailFeedback = validateInputs(state.email, "email");
  const passwordFeedback = validateInputs(state.password, "password");
  const confirmPasswordFeedback = validateInputs(
    state.password,
    "password2",
    state.password2
  );
  const termCheckFeedback = state.termCheck
    ? { status: true, message: "Terms and conditions accepted" }
    : { status: false, message: "You must accept the terms and conditions." };

  return {
    firstNameFeedback,
    lastNameFeedback,
    emailFeedback,
    passwordFeedback,
    confirmPasswordFeedback,
    termCheckFeedback,
  };
};

export const handleSignUp = async (
  state: typeof initialState,
  dispatch: any,
  router: any
) => {
  dispatch({ type: "SET_LOADING", value: true });
  dispatch({ type: "SET_ERROR", value: null });
  dispatch({
    type: "SET_FEEDBACK",
    feedback: {
      firstNameFeedback: null,
      lastNameFeedback: null,
      emailFeedback: null,
      passwordFeedback: null,
      confirmPasswordFeedback: null,
    },
  });

  const payload = {
    first_name: state.firstName,
    last_name: state.lastName,
    email: state.email,
    phone_number: state.phone_number,
    password: state.password,
  };

  try {
    await publicAPI.post(ENDPOINTS.SIGN_UP, payload);
    router.push(`/verification?email=${encodeURIComponent(state.email)}`);
  } catch (err: any) {
    // console.log(err);

    if (err.response) {
      const { status } = err.response;

      switch (status) {
        case 400:
          if (err.response.data?.email) {
            toast.error(err.response.data?.email?.join("\n"));
            return;
          }
          if (err.response.data?.password)
            toast.error(err.response.data?.password?.join("\n"));
          break;

        case 500:
          dispatch({
            type: "SET_ERROR",
            value: "Server error! Please try again later.",
          });
          break;

        default:
          dispatch({
            type: "SET_ERROR",
            value: "Failed to sign up! Please try again.",
          });
          break;
      }
    } else {
      dispatch({
        type: "SET_ERROR",
        value: "Ensure you are connected to the internet.",
      });
    }
  } finally {
    dispatch({ type: "SET_LOADING", value: false });
  }
};

// State Management
export const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  password2: "",
  phone_number: "",
  termCheck: false,
  firstNameFeedback: null,
  lastNameFeedback: null,
  emailFeedback: null,
  passwordFeedback: null,
  confirmPasswordFeedback: null,
  termCheckFeedback: null,
  isLoading: false,
  error: null,
};

export type SignUpAction =
  | { type: "SET_FIELD"; field: string; value: string }
  | {
      type: "SET_FEEDBACK";
      feedback: {
        firstNameFeedback: any;
        lastNameFeedback: any;
        emailFeedback: any;
        passwordFeedback: any;
        confirmPasswordFeedback: any;
      };
    }
  | { type: "SET_LOADING"; value: boolean }
  | {
      type: "SET_USER_TYPE";
      value: "benefactor" | "beneficiary" | "organisation";
    }
  | { type: "SET_ERROR"; value: string | null }
  | { type: "RESET" };

export const signUpReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_USER_TYPE":
      return { ...state, userType: action.value };
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
