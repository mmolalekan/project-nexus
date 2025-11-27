import { FailedIcon, VerifiedIcon } from "@/shared/allIcons";
import { PaymentStatus } from "@/app/payment-complete/page";

export const PageHeaderIcon = ({ status }: PaymentStatus) => (
  <div className={`size-14 grid place-content-center`}>
    {status === "successful" ? (
      <VerifiedIcon />
    ) : status === "cancelled" ? (
      <FailedIcon />
    ) : status === "completed" ? (
      <VerifiedIcon />
    ) : null}
  </div>
);
