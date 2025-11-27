"use client";

import { Button, Input } from "@/shared/allComps";
import { AuthContainer, QurbaanLogo } from "../comps";
import { useReducer, useSearchParams } from "@/shared/common";

import {
  validatePWDInputs,
  handleResetPassword,
  initialState,
  // PWDResetAction,
  PWDResetReducer,
} from "./utils";

const ResetPassword = () => {
  const uidb64 = useSearchParams().get("uid");
  const token = useSearchParams().get("token");
  const [state, dispatch] = useReducer(PWDResetReducer, initialState);

  const handleFieldChange = (field: string, value: string) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const handleSubmit = async () => {
    const { passwordFeedback, confirmPasswordFeedback } =
      validatePWDInputs(state);

    dispatch({
      type: "SET_FEEDBACK",
      feedback: {
        passwordFeedback: passwordFeedback,
        confirmPasswordFeedback: confirmPasswordFeedback,
      },
    });

    if (!passwordFeedback.status || !confirmPasswordFeedback.status) {
      dispatch({
        type: "SET_ERROR",
        value: "Please correct the errors to proceed.",
      });
      return;
    }

    await handleResetPassword(uidb64, token, state.password, dispatch);
  };
  return (
    <AuthContainer
      isLoading={state.isLoading}
      goback={{ title: "Back to Sign In", link: "/sign-in" }}
    >
      <div className="col-5 w-full items-center">
        <QurbaanLogo />
        <div className="col-5 items-center">
          <h1 className="inter-2xl-bold-mb-500 text-center">Reset Password</h1>
          <p className="inter-sm-normal-mb-400 leading-[150%] w-full text-center">
            Set a new password below
          </p>
        </div>
        <div className="col-7 w-full">
          <form className="col-5 w-full">
            <Input
              type="password"
              placeholder="New Password"
              value={state.password}
              feedback={state.passwordFeedback}
              onChange={(e) => handleFieldChange("password", e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={state.password2}
              feedback={state.confirmPasswordFeedback}
              onChange={(e) => handleFieldChange("password2", e.target.value)}
            />
          </form>
          <Button
            text="Reset Password"
            onClick={handleSubmit}
            status={
              state.error ? { message: state.error, type: "error" } : null
            }
          />
        </div>
      </div>
    </AuthContainer>
  );
};

export default ResetPassword;
