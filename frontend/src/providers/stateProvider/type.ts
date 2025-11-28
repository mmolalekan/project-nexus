export interface UserProfile {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  gender: string;
  address: string;
  city: string;
  referral_code: string;
  total_referral_earnings: string;
  account_number: string;
  account_name: string;
  bank_name: string;
}

export interface BookingSummary {
  overall_bookings: {
    total_slots_booked: number;
    total_amount_generated: number;
  };
  package_breakdown: {
    basic: {
      total_slots_booked: number;
      total_amount_generated: number;
    };
    standard: {
      total_slots_booked: number;
      total_amount_generated: number;
    };
  };
  overall_referral_stats: {
    total_referral_earnings: number;
    total_referrals_used: number;
  };
}

export interface MyBookings {
  id: number;
  user: number;
  package_type: "basic" | "standard";
  delivery_option: "pickup" | "delivery";
  slots: number;
  amount: string;
  paid: boolean;
  created_at: string;
  referral_code: string;
  status: "pending";
}

export interface State {
  isLoading: boolean;
  error: string | null;
  nav: boolean;
  profile: UserProfile | null;
  myBookings: MyBookings[];
  bookingSummary: BookingSummary | null;
  //modals
  signOutModal: boolean;
  profileModal: boolean;
  referralModal: boolean;
  bookSlotModal: boolean;
  helpModal: boolean;
}

export type ModalKeys =
  | "signOutModal"
  | "profileModal"
  | "referralModal"
  | "bookSlotModal"
  | "helpModal";

export type StateAction =
  | { type: "TOGGLE_MODAL"; field: ModalKeys }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_NAV" }
  | { type: "SET_MY_BOOKINGS"; payload: MyBookings[] }
  | { type: "SET_BOOKING_SUMMARY"; payload: BookingSummary }
  | { type: "SET_PROFILE"; payload: UserProfile }
  | { type: "CLEAR_PROFILE" }
  | { type: "RESET_STATE" };
