/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Container } from "./components";
import { NoBookings } from "../icons";
import { MyBookings } from "@/providers/stateProvider/type";
import { formatAmount } from "../modals/slot/utils";
import { LoadingState } from "@/shared/allIcons";

interface Props {
  myBookings: MyBookings[];
  bookAction: () => void;
  loading?: boolean;
}

export const Bookings = ({ myBookings, bookAction, loading }: Props) => {
  const header = {
    date: "Date",
    slots: "Slots",
    amount: "Amount",
    delivery: "Delivery",
    status: "Status",
  };

  if (loading) return <LoadingState />;

  if (!myBookings?.length) {
    return (
      <Container title="My Bookings" padding="p-6">
        <div className="flex col-6 items-center justify-center">
          <div className="col-4">
            <NoBookings />
            <p className="inter-xs-medium-mb-900">No bookings.</p>
          </div>
          <button
            onClick={bookAction}
            className="inter-sm-bold-sec-500 py-2 px-8 bg-mb-800 rounded-xl"
          >
            Book a Slot
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container title="My Bookings" padding="">
      {/* desktop size */}
      <div className="hidden bp:block overflow-y-auto">
        <DesktopTableContent content={header} type="header" />
        {myBookings.map((booking, index) => (
          <DesktopTableContent
            key={index}
            content={transformBooking(booking)}
            type="body"
          />
        ))}
      </div>
      {/* Mobile size */}
      {myBookings.map((booking, index) => (
        <MobileTableContent key={index} content={transformBooking(booking)} />
      ))}
      <div className="sm:hidden flex flex-row justify-end items-end px-6 py-3">
        <button
          onClick={bookAction}
          className=" inter-xs-bold-sec-500 py-2 px-8 bg-mb-800 rounded-xl"
        >
          Book another Slot
        </button>
      </div>
    </Container>
  );
};

interface TableContentProps {
  type: "header" | "body";
  content: Record<string, any>;
}

export const DesktopTableContent = ({ content, type }: TableContentProps) => {
  //width calc - 144: 17.8/16.67, 264: 32.7/33.37, 185: 22.9/20, 169: 20.9, 45: 5.5 = 807

  switch (type) {
    case "header":
      return (
        <div className="flex flex-row border-b border-mb-50 items-center bg-mb-50/50 w-full">
          {Object.entries(content).map(([key, value], index) => (
            <span
              key={index}
              className="py-3 px-6 inter-xs-medium-mb-700 text-nowrap text-start"
            >
              {value}
            </span>
          ))}
        </div>
      );
    case "body":
      return (
        <div className="flex flex-row items-center border-b border-mb-50 bg-white w-full">
          {Object.entries(content).map(([key, value], index) => {
            return (
              <span
                key={index}
                className="text-nowrap inter-xs-normal-mb-700 py-3 px-6 text-start"
              >
                {key === "amount" ? formatAmount(value) : value}
              </span>
            );
          })}
        </div>
      );
  }
};

interface MobileTableContentProps {
  content: Record<string, any>;
}

const MobileTableContent = ({ content }: MobileTableContentProps) => {
  return (
    <div className="bp:hidden px-6 py-4 col-2 border-b border-mb-50">
      <div className="row-1 justify-between items-center">
        <div className="col-1">
          <span className="inter-sm-medium-mb-900">
            {content.slots} {Number(content.slots) < 2 ? "slot" : "slots"}
          </span>
          <span className="inter-sm-normal-mb-700 overflow-hidden text-ellipsis">
            {content.amount}
          </span>
        </div>
        <span className="inter-sm-medium-mb-700">{content.status}</span>
      </div>
      <div className="border-b border-mb-50"></div>
      <div className="flex flex-row justify-between">
        <span className="inter-xs-medium-mb-600">Date</span>
        <span className="inter-xs-normal-mb-700">{content.date}</span>
      </div>
    </div>
  );
};

const transformBooking = (booking: MyBookings) => {
  return {
    date: new Date(booking.created_at).toLocaleDateString(),
    slots: booking.slots,
    amount: booking.amount,
    delivery:
      booking.delivery_option.charAt(0).toUpperCase() +
      booking.delivery_option.slice(1),
    status: booking.paid ? "Paid" : "Pending",
  };
};
