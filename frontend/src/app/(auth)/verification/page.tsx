"use client";

import {
  initialState,
  handleVerifyCode,
  handleResendCode,
  verificationReducer,
} from "./utils";
import { useReducer } from "@/shared/common";
import { useSearchParams, useRouter } from "@/shared/common";
import { AuthContainer, QurbaanLogo, Countdown } from "../comps";
import { HeadingTitles, Button, Alert } from "@/shared/allComps";

const VerificationPage = () => {
  const email = useSearchParams().get("email");
  const router = useRouter();

  // useEffect(() => {
  //     if (!email) router.push("/sign-in");
  // }, [email, router]);

  const [state, dispatch] = useReducer(verificationReducer, initialState);
  const { value, countdown, verified, isLoading, error } = state;
  const isResendDisabled = countdown !== null;

  return (
    <AuthContainer
      isLoading={isLoading}
      goback={{ title: "Back to Sign In", link: "/sign-in" }}
    >
      <div className="col-5 w-full justify-center items-center">
        <QurbaanLogo />
        <HeadingTitles
          title="OTP Verification!"
          subtitle={`Your Verification code has been sent to ${email}`}
          align="center"
        />
        <span className="inter-xs-bold-err-300">Not in Inbox? check Spam!</span>
        <div className="col-6 items-center">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            pattern="\d*"
            value={state.value}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "value",
                value: e.target.value,
              })
            }
            className="my-4 py-2 max-w-64 text-center tracking-[0.5em] inter-3xl-bold-mb-300 border rounded-lg shadow-md focus:ring-8 focus:ring-pry-50 focus:outline-none 
            placeholder:tracking-normal placeholder:inter-base-normal-mb-100"
            placeholder="Enter 6-digit code"
          />
          <Countdown countdown={countdown} text="Retry in" bgColor="" />
          <div className="flex items-center justify-center gap-2">
            <span className="inter-sm-medium-mb-800">
              Didn&apos;t receive the code?
            </span>
            <button
              onClick={() => handleResendCode(email, dispatch)}
              disabled={isResendDisabled}
              className={`inter-sm-medium-sec-500 ${
                isResendDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Resend code
            </button>
          </div>
        </div>
        <div className="w-full self-center">
          <Button
            text="Verify"
            onClick={() => handleVerifyCode(email, value, dispatch)}
            status={error ? { message: error, type: "error" } : null}
          />
        </div>
        {verified && (
          <Alert
            status={verified && "successful"}
            title="Account Created Successfully!"
            subtitle=""
            CTA="Sign In"
            onClick={() => router.push("/sign-in")}
          />
        )}
      </div>
    </AuthContainer>
  );
};

export default VerificationPage;
