"use client";

import {
  handleLogIn,
  logInReducer,
  initialState,
  validateLogInInputs,
} from "./utils";
import { Input, Button } from "@/shared/allComps";
import { QurbaanLogo, Footer, AuthContainer } from "../comps";
import { useReducer, useRouter, Link } from "@/shared/common";

const LogIn = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(logInReducer, initialState);

  const handleFieldChange = (field: string, value: string) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const handleSubmit = async () => {
    const feedback = validateLogInInputs(state);

    dispatch({
      type: "SET_FEEDBACK",
      feedback: {
        emailFeedback: feedback.emailFeedback,
        passwordFeedback: feedback.passwordFeedback,
      },
    });

    if (!feedback.emailFeedback.status || !feedback.passwordFeedback.status) {
      dispatch({
        type: "SET_ERROR",
        value: "Please correct the errors before logging in.",
      });
      return;
    }

    await handleLogIn(state, dispatch, router);
  };
  return (
    <AuthContainer isLoading={state.isLoading}>
      <div className="col-5 w-full items-center">
        <QurbaanLogo />
        <h2 className="inter-2xl-bold-mb-500 leading-[150%] text-center">
          Sign In
        </h2>

        <div className="col-5 w-full">
          <form className="col-5">
            <Input
              type="email"
              placeholder="Enter your email"
              value={state.email}
              feedback={state.emailFeedback}
              onChange={(e) => handleFieldChange("email", e.target.value)}
            />
            <Input
              type="password"
              placeholder="Enter your password"
              value={state.password}
              feedback={state.passwordFeedback}
              onChange={(e) => handleFieldChange("password", e.target.value)}
            />
          </form>
          <Button
            text="Sign In"
            onClick={handleSubmit}
            status={
              state.error ? { message: state.error, type: "error" } : null
            }
          />
          <div className="row-1 items-center inter-sm-normal-mb-400 justify-between">
            <div className="row-1 items-center"></div>
            <Link href="/forgot-password" className="text-pry-500">
              Forgot password?
            </Link>
          </div>
          <Footer
            text="Don't have an account? "
            link="/sign-up"
            title="Sign Up"
            align="center"
          />
        </div>
      </div>
    </AuthContainer>
  );
};

export default LogIn;
