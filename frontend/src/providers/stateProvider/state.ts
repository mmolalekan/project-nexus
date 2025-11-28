import { State, StateAction, ModalKeys } from "./type";

export const initialState: State = {
  isLoading: false,
  error: null,
  nav: false,
  profile: null,
  bookingSummary: null,
  myBookings: [],
  //modals
  signOutModal: false,
  profileModal: false,
  referralModal: false,
  bookSlotModal: false,
  helpModal: false,
};

export function stateReducer(state: State, action: StateAction) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_NAV":
      return { ...state, nav: !state.nav };
    case "SET_MY_BOOKINGS":
      return { ...state, myBookings: action.payload };
    case "SET_BOOKING_SUMMARY":
      return { ...state, bookingSummary: action.payload };
    case "SET_PROFILE":
      return { ...state, profile: action.payload };
    case "CLEAR_PROFILE":
      return { ...state, profile: null };
    case "TOGGLE_MODAL":
      const modalFields: ModalKeys[] = [
        "signOutModal",
        "profileModal",
        "referralModal",
        "bookSlotModal",
        "helpModal",
      ];
      return {
        ...state,
        ...modalFields.reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {} as Record<ModalKeys, boolean>),
        [action.field]: !state[action.field], // toggle the one you clicked
      };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
}
