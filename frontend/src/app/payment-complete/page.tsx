"use client";

import { Suspense } from "react";
import { Alert } from "@/shared/allComps";
import { useSearchParams, useRouter } from "@/shared/common";

const PaymentComplete = () => {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
};
export default PaymentComplete;

export interface PaymentStatus {
  status: "successful" | "cancelled" | "completed" | "unknown";
}

const Content = () => {
  const router = useRouter();
  const rawStatus = useSearchParams().get("status");
  const status =
    rawStatus === "successful" ||
    rawStatus === "cancelled" ||
    rawStatus === "completed"
      ? rawStatus
      : "unknown";

  const data = {
    successful: {
      title: "Payment Successful",
      subtitle: "",
    },
    cancelled: {
      title: "Payment Cancelled",
      subtitle: "Your payment was cancelled. Please try again.",
    },
    completed: {
      title: "Payment Completed",
      subtitle:
        "Your payment has been completed. You can view the updated status on your dashboard.",
    },
    unknown: {
      title: "Payment Status Unknown",
      subtitle:
        "We could not determine the payment status. Please check 'My Bookings' on the dashboard for an update or contact support.",
    },
  };

  return (
    <div className="max-w-96">
      <Alert
        status={status}
        title={data?.[status]?.title || ""}
        subtitle={data?.[status]?.subtitle || ""}
        CTA="Back to Dashboard"
        onClick={() => router.push("/dashboard")}
      />
    </div>
  );
};
