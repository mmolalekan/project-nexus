import { Booking, BookingAction } from "./type";

export const initialState: Booking = {
  package_type: null,
  delivery_option: false,
  budget: null,
  slots: null,
  referral_code: "",
  referrer: null,
  isLoading: false,
  error: null,
};

export const bookingReducer = (state: Booking, action: BookingAction) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "RESET":
      return initialState;
    default:
      throw new Error("Unknown action type");
  }
};

export const slotsGroup = [
  // 4 max inline with flutterwave 500k maximum
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
];

export const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};
