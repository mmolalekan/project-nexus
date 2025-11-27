/* eslint-disable @typescript-eslint/no-explicit-any */
export const startCountdown = (dispatch: any, startTime: number = 70) => {
  let remainingTime = startTime;

  dispatch({ type: "SET_COUNTDOWN", value: remainingTime });

  const interval = setInterval(() => {
    remainingTime -= 1;

    if (remainingTime <= 0) {
      clearInterval(interval);
      dispatch({ type: "SET_COUNTDOWN", value: null }); // End countdown
    } else {
      dispatch({ type: "SET_COUNTDOWN", value: remainingTime });
    }
  }, 1000);
};

export const formatCountdown = (countdown: number): string => {
  const hours = Math.floor(countdown / 3600);
  const minutes = Math.floor((countdown % 3600) / 60);
  const seconds = countdown % 60;

  // Format the time components as two-digit numbers
  const formattedHours = hours > 0 ? `${String(hours).padStart(2, "0")}:` : "";
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
};
