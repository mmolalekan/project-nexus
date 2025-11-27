const demoDynamicAPI = (id: number) => `enrollment/courses/${id}/levels/`;

export const ENDPOINTS = {
  // auth
  SIGN_UP: "auth/register/",
  VERIFY_EMAIL: "auth/verify-email/",
  RESEND_CODE: "auth/resend-verification-code/",
  FORGOT_PASSWORD: "auth/forgot-password/",
  RESET_PASSWORD: "auth/reset-password/",
  LOGIN: "auth/login/",
  IS_LOGGED_IN: "auth/token/validity/",
  REFRESH: "auth/token/refresh/",
  LOGOUT: "auth/logout/",

  // profile
  GET_PROFILE: "auth/profile/",
  UPDATE_PROFILE: "auth/profile/update/",

  // bookings
  IS_REFERRER_VALID: "booking/validate-referral-code/",
  BOOK_SLOT: "booking/generate-payment-link/",
  GET_MY_BOOKINGS: "booking/bookings/",
  GET_BOOKING_SUMMARY: "booking/bookings-summary/",
  DEMO_DYNAMIC_API: demoDynamicAPI,
};
