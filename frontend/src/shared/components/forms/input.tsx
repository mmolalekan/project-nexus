import { useState } from "@/shared/common";
import { HidePassword, ShowPassword } from "@/shared/allIcons";

interface InputProps {
  label?: string;
  required?: boolean;
  type: string;
  disabled?: boolean;
  placeholder: string;
  value: string;
  feedback?: { status: boolean; message: string } | null;
  min?: number;
  max?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = (props: InputProps) => {
  // for password only
  const [viewPassword, setViewPassword] = useState("password");
  const togglePasswordVisibility = () => {
    setViewPassword((prev) => (prev === "password" ? "text" : "password"));
  };

  const getInputBorderClass = (feedback: InputProps["feedback"]) => {
    if (!feedback) return "border-gray-300";
    return feedback.status ? "border-sux-300" : "border-err-200";
  };
  return (
    <div className="col-2">
      <div className="col-4">
        {props.label ? (
          <label
            htmlFor={props.label}
            className="inter-sm-medium-gray900 leading-5"
          >
            {props.label}
            {props.required ? <span className="text-err-500 px-1">*</span> : ""}
          </label>
        ) : (
          ""
        )}
        <div
          className={`relative flex place-items-center rounded-md border h-11 ${getInputBorderClass(
            props.feedback
          )}`}
        >
          <input
            type={props.type === "password" ? viewPassword : props.type}
            placeholder={props.placeholder}
            disabled={props.disabled}
            value={props.value}
            min={props.min}
            max={props.max}
            onChange={props.onChange}
            className={` ${
              props.disabled && "cursor-not-allowed bg-black/30"
            } p-2 sm:p-4 w-full h-full rounded-md inter-sm-normal-mb-300 
              placeholder:text-gray-400 border border-mb-300 bg-transparent placeholder:text-xs sm:placeholder:text-sm`}
          />
          <div className="absolute right-4">
            {renderInputIcon(
              props.type,
              viewPassword,
              togglePasswordVisibility
            )}
          </div>
        </div>
      </div>
      {props.feedback && (
        <span
          className={`font-inter text-sm font-normal ${
            props.feedback.status ? "text-sux-600" : "text-err-500"
          }`}
        >
          {props.feedback.message}
        </span>
      )}
    </div>
  );
};

// Icon rendering logic
const renderInputIcon = (
  type: string,
  viewPassword: string,
  togglePasswordVisibility: () => void
) => {
  if (type === "password") {
    return (
      <span className="cursor-pointer" onClick={togglePasswordVisibility}>
        {viewPassword === "password" ? <HidePassword /> : <ShowPassword />}
      </span>
    );
  }
  return null;
};
