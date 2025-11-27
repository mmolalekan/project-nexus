import { StatusIcon, LoadingState } from "@/shared/allIcons";
import { useState, clsx } from "@/shared/common";

interface ButtonProps {
  text: string;
  type?: "button" | "onboarding";
  onClick?: () => void;
  disabled?: boolean;
  status?: { message: string; type: "success" | "error" } | null;
}

export const Button = ({
  text,
  onClick,
  type = "button",
  disabled = false,
  status,
}: ButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  // Handle click function to toggle loading state
  const handleClick = async () => {
    setIsLoading(true);
    if (onClick) await onClick();
    setIsLoading(false);
  };
  return (
    <div className="col-3 w-full">
      <button
        onClick={handleClick}
        disabled={isLoading || disabled}
        className={clsx(
          "rounded-lg px-3 py-5 h-11 grid place-content-center text-center inter-sm-bold-white",
          {
            "bg-sec-50 text-pry-500": type === "onboarding",
            "bg-pry-500 text-white": type === "button" && !disabled,
            "cursor-not-allowed bg-gray-300 text-white": disabled,
          }
        )}
      >
        {isLoading ? <LoadingState /> : text}
      </button>
      {/* Show the status icon and message if status is provided */}
      {status && (
        <div
          className={`rounded-md h-11 row-1 items-center p-3 ${
            status.type === "error" ? "bg-err-50" : "bg-sux-50"
          }`}
        >
          <StatusIcon />
          {/* <StatusIcon type={status.type} /> You can customize StatusIcon to handle different types */}
          <span className="inter-xs-normal-err-500">{status.message}</span>
        </div>
      )}
    </div>
  );
};
