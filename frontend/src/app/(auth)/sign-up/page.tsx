"use client";

import {
  handleSignUp,
  initialState,
  signUpReducer,
  validateSignUpInputs,
} from "./utils";
import { Input, Button } from "@/shared/allComps";
import { QurbaanLogo, Footer, AuthContainer } from "../comps";
import { useReducer, useRouter, Link } from "@/shared/common";
import { PhoneNumber } from "@/shared/components/forms/phoneInput";

const SignUp = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(signUpReducer, initialState);

  const handleFieldChange = (field: string, value: string | boolean) => {
    dispatch({
      type: "SET_FIELD",
      field,
      value,
    });
  };

  const handleSubmit = async () => {
    const feedback = validateSignUpInputs(state);

    dispatch({
      type: "SET_FEEDBACK",
      feedback: {
        firstNameFeedback: feedback.firstNameFeedback,
        lastNameFeedback: feedback.lastNameFeedback,
        emailFeedback: feedback.emailFeedback,
        passwordFeedback: feedback.passwordFeedback,
        confirmPasswordFeedback: feedback.confirmPasswordFeedback,
        termCheckFeedback: feedback.termCheckFeedback,
      },
    });

    if (
      !feedback.firstNameFeedback ||
      !feedback.lastNameFeedback ||
      !feedback.emailFeedback.status ||
      !feedback.passwordFeedback.status ||
      !feedback.confirmPasswordFeedback.status ||
      !feedback.termCheckFeedback.status
    ) {
      dispatch({
        type: "SET_ERROR",
        value: "Please correct the errors before signing up.",
      });
      return;
    }

    await handleSignUp(state, dispatch, router);
  };

  return (
    <AuthContainer isLoading={state.isLoading}>
      <div className="col-5 w-full justify-center items-center">
        <QurbaanLogo />

        <div className="col-2 items-center">
          <h2 className="inter-2xl-bold-black">Sign Up</h2>
          <p className="inter-base-medium-mb-400 text-center">
            Enter details to create your account
          </p>
        </div>
        <div className="col-5">
          <form className="col-5">
            <div className="flex justify-between gap-4">
              <Input
                type="text"
                placeholder="First Name"
                value={state.firstName}
                feedback={state.firstNameFeedback}
                onChange={(e) => handleFieldChange("firstName", e.target.value)}
              />
              <Input
                type="text"
                placeholder="Last Name"
                value={state.lastName}
                feedback={state.lastNameFeedback}
                onChange={(e) => handleFieldChange("lastName", e.target.value)}
              />
            </div>
            <Input
              type="email"
              placeholder="Email Address"
              value={state.email}
              feedback={state.emailFeedback}
              onChange={(e) => handleFieldChange("email", e.target.value)}
            />
            <PhoneNumber
              label="Phone Number"
              phone={state.phone_number || ""}
              onChange={handleFieldChange}
            />
            <Input
              type="password"
              placeholder="Create Password"
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
            <div className="row-2 items-center">
              <input
                className="size-4 mr-1 cursor-pointer"
                type="checkbox"
                id="checkbox"
                onChange={(e) =>
                  handleFieldChange("termCheck", e.target.checked)
                }
              />

              <label
                htmlFor="checkbox"
                className={`font-inter text-xs ${
                  state?.termCheckFeedback && !state?.termCheckFeedback?.status
                    ? "text-err-500"
                    : "text-mb-400"
                }`}
              >
                By signing up, you agree to our{" "}
                <Link href="" className="inter-xs-bold-sec-500">
                  Terms and conditions
                </Link>
              </label>
            </div>
          </form>
          <Button
            text="Save & Continue"
            onClick={handleSubmit}
            status={
              state.error ? { message: state.error, type: "error" } : null
            }
          />
          <Footer
            text="You have account already? "
            link="/sign-in"
            title="Sign In"
            align="center"
          />
        </div>
      </div>
    </AuthContainer>
  );
};

export default SignUp;
