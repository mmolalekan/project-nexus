import { bookSlot } from "./api";
import { SaveIcon } from "../../icons";
import { PayNow, ChooseBudget } from "./tabs";
import { LeftArrow } from "@/shared/allIcons";
import { useReducer } from "@/shared/common";
import { bookingReducer, initialState } from "./utils";
import { Booking, BookingAction, BodyProps } from "./type";
import { Button, Modal } from "../../components/components";

export const BookSlot = ({ close }: { close: () => void }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <Modal
      loading={state.isLoading}
      header={{ title: "Book A Slot" }}
      body={<Body state={state} dispatch={dispatch} />}
      footer={
        state.package_type && <Footer state={state} dispatch={dispatch} />
      }
      close={close}
    />
  );
};

const Body = ({ state, dispatch }: BodyProps) => (
  <div>
    {!state.package_type ? (
      <ChooseBudget dispatch={dispatch} />
    ) : (
      <PayNow state={state} dispatch={dispatch} />
    )}
  </div>
);
interface FooterProps {
  close?: () => void;
  state: Booking;
  dispatch: React.Dispatch<BookingAction>;
}
const Footer = ({ state, dispatch }: FooterProps) => {
  const handleBack = () => {
    dispatch({ type: "SET_FIELD", field: "package_type", payload: null });
    dispatch({ type: "SET_FIELD", field: "budget", payload: null });
    dispatch({ type: "SET_FIELD", field: "referrer", payload: null });
    dispatch({ type: "SET_FIELD", field: "delivery_option", payload: null });
    dispatch({ type: "SET_FIELD", field: "slots", payload: null });
    dispatch({ type: "SET_FIELD", field: "referral_code", payload: "" });
  };
  return (
    <div className="row-4 justify-between">
      <Button
        text="Back"
        type="cancel"
        icon={<LeftArrow />}
        onClick={handleBack}
      />
      <Button
        text="Pay Now"
        type="button"
        icon={<SaveIcon />}
        onClick={() => bookSlot(state, dispatch)}
      />
    </div>
  );
};
