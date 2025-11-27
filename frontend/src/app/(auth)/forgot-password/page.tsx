"use client";

import {
  initialState,
  handleForgotPassword,
  ForgotPasswordReducer,
  validatePasswordInputs,
} from "./utils";
import { useReducer } from "@/shared/common";
import { Button, Input } from "@/shared/allComps";
import { AuthContainer, Footer, QurbaanLogo } from "../comps";

const ForgotPassword = () => {
  const [state, dispatch] = useReducer(ForgotPasswordReducer, initialState);

  const handleFieldChange = (field: string, value: string) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const handleSubmit = async () => {
    const { emailFeedback } = validatePasswordInputs(state.email);

    dispatch({
      type: "SET_FEEDBACK",
      feedback: { emailFeedback: emailFeedback },
    });

    if (!emailFeedback.status) {
      dispatch({
        type: "SET_ERROR",
        value: "Please correct the errors before logging in.",
      });
      return;
    }

    await handleForgotPassword(state.email, dispatch);
  };

  return (
    <AuthContainer isLoading={state.isLoading}>
      <div className="col-5 w-full justify-center items-center">
        <QurbaanLogo />
        <div className="col-5 items-center">
          <h1 className="inter-2xl-bold-mb-500 ">Forgot Password</h1>
          <p className="inter-sm-normal-mb-400 leading-[150%] text-center w-full">
            Input your email address below to receive your password reset
            instructions.
          </p>
        </div>
        {state.verified && (
          <div className="col-2 items-center bg-sec-50 rounded-xl py-8 px-4 w-80">
            <p className="inter-sm-normal-sec-400 leading-[150%] text-center">
              Instruction to reset your password will be sent to your email.
            </p>
            <span className="inter-xs-bold-err-300">
              Not in Inbox? check Spam!
            </span>
          </div>
        )}
        <div className="col-7 w-full">
          <form>
            <Input
              type="email"
              placeholder="Email Address"
              value={state.email}
              feedback={state.emailFeedback}
              onChange={(e) => handleFieldChange("email", e.target.value)}
            />
          </form>
          <Button
            text="Continue"
            onClick={handleSubmit}
            status={
              state.error ? { message: state.error, type: "error" } : null
            }
          />
        </div>
        <div>
          <Footer
            text="Don't have an account? "
            link="/sign-up"
            title="Sign Up"
          />
        </div>
      </div>
    </AuthContainer>
  );
};

export default ForgotPassword;
