/* eslint-disable @typescript-eslint/no-explicit-any */

interface Referrer {
  valid: boolean;
  referrer_id?: number;
  referrer_name?: string;
  error: string;
}

export interface Booking {
  // backend booking fields
  package_type?: "basic" | "standard" | null;
  delivery_option: boolean; // true for delivery, false for pickup
  budget: 85000 | 125000 | null;
  slots: number | null;
  referral_code: string;
  // UI fields
  referrer: Referrer | null;
  isLoading: boolean;
  error: string | null;
}

export type BookingAction =
  | { type: "SET_FIELD"; field: keyof Booking; payload: any }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET" };

export interface BodyProps {
  state: Booking;
  dispatch: React.Dispatch<BookingAction>;
}
