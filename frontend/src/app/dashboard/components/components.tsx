/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, clsx } from "@/shared/common";
import { CloseIcon, ButtonStatus, LoadingState } from "../icons";
import { PageLoadingContainer } from "@/shared/allComps";

interface ModalProps {
  header: { title: string; icon?: React.ReactNode };
  loading?: boolean;
  body: React.ReactNode;
  footer?: React.ReactNode;
  close: () => void;
}

export const Modal = (props: ModalProps) => {
  const { header, body, footer, close, loading = false } = props;
  return (
    <PageLoadingContainer isLoading={loading}>
      <div className="p-4 fixed inset-0 bg-black-500 bg-opacity-80 flex items-center justify-center">
        <div className=" rounded-xl size-fit bg-white max-w-[500px] w-full">
          <div className="flex flex-col ">
            {/* Header */}
            <div className="row-4 border-b py-5 px-6">
              <div className="row-4 w-full items-center">
                {header.icon}
                <span className="inter-lg-medium-black-500">
                  {header.title}
                </span>
              </div>
              <button
                onClick={close}
                className="rounded-lg border border-modal-b p-2"
              >
                <CloseIcon />
              </button>
            </div>
            {/* Others */}
            <div className="p-6 border-b">{body}</div>
            <div className="p-4">{footer}</div>
          </div>
        </div>
      </div>
    </PageLoadingContainer>
  );
};

interface ButtonProps {
  text: string;
  icon?: React.ReactNode;
  type?: "button" | "danger" | "cancel";
  onClick?: () => void;
  disabled?: boolean;
  status?: { message: string; type: "success" | "error" } | null;
}

export const Button = ({
  text,
  icon,
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
    <div className="col-3 w-full max-w-[480px]">
      <button
        onClick={handleClick}
        disabled={isLoading || disabled}
        className={clsx(
          "rounded-lg px-4 py-2 grid border place-content-center text-center font-inter font-semibold text-sm",
          {
            "cursor-not-allowed bg-mb-300 text-white": disabled,
            "bg-pry-500 text-white": type === "button" && !disabled,
            "bg-red-500 text-white": type === "danger" && !disabled,
            "bg-white border-modal-b text-gray-500":
              type === "cancel" && !disabled,
          }
        )}
      >
        {isLoading ? (
          <LoadingState />
        ) : (
          <div className="row-1 items-center">
            {icon && <span>{icon}</span>}
            <span>{text}</span>
          </div>
        )}
      </button>
      {status && (
        <div
          className={`rounded-md h-11 row-1 items-center p-3 ${
            status.type === "error" ? "bg-err50" : "bg-success50"
          }`}
        >
          <ButtonStatus />
          <span className="inter-xs-normal-err500">{status.message}</span>
        </div>
      )}
    </div>
  );
};

interface ContainerProps {
  children: React.ReactNode;
  title: string;
  padding: string;
}

export const Container = ({ children, title, padding }: ContainerProps) => {
  return (
    <div className="col-2 bp:max-w-[600px]">
      <span className="inter-base-medium-mb-400">{title}</span>
      <div className={`bg-white border border-mb-50 ${padding} rounded-2xl`}>
        {children}
      </div>
    </div>
  );
};

interface ToggleSwitchProps {
  state: boolean;
  dispatch: any;
  text?: string;
}
export const ToggleSwitch = ({ state, dispatch, text }: ToggleSwitchProps) => {
  return (
    <div className="row-4 items-center w-full">
      <span className="inter-sm-medium-mb-400">{text}</span>
      <button
        onClick={dispatch}
        className={`w-10 h-5 flex items-center rounded-full p-1 transition ${
          state ? "bg-pry-500" : "bg-mb-100"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
            state ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};
