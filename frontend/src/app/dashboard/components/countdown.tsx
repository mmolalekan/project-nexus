import { Container } from "./components";
import { formatAmount } from "../modals/slot/utils";
import { StreakIcon, HighestScoreIcon } from "../icons";
import { useState, useEffect, Image } from "@/shared/common";
import { useGlobalState } from "@/providers/stateProvider/provider";

const targetDate = "2025-06-05T19:00:00";
const bookingEndsAt = "Last Saturday of Every Month";
const amount = { basic: 85000, standard: 25000 };

export const Streak = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    getTimeLeft(targetDate)
  );
  useEffect(() => {
    const timer = setInterval(() => {
      const updated = getTimeLeft(targetDate);
      setTimeLeft(updated);
      if (!updated) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { globalState } = useGlobalState();
  const bookingSummary = globalState.bookingSummary;
  if (!bookingSummary) return null; // or loading spinner
  const { package_breakdown } = bookingSummary;
  // const { overall_bookings } = bookingSummary;

  const basicRaw = package_breakdown?.basic.total_slots_booked || 0;
  const standardRaw = package_breakdown?.standard.total_slots_booked || 0;

  const eidValue = getDisplaySlotValue(basicRaw, 8);
  const monthlyValue = getDisplaySlotValue(standardRaw, 3);
  const totalValue = eidValue + monthlyValue;

  const data = [
    { name: "\u00B1 DAYS", value: timeLeft?.days },
    { name: "HOURS", value: timeLeft?.hours },
    { name: "MINUTES", value: timeLeft?.minutes },
    { name: "SECONDS", value: timeLeft?.seconds },
  ];

  return (
    <Container
      title=""
      padding="p-6 col-6 w-full bp:max-w-[500px] items-center"
    >
      <Image
        width={300}
        height={250}
        src={timeLeft ? "/images/qurbaan2.png" : "/images/qurbaan2.png"}
        alt=""
        className="w-fit rounded-lg bg-pry-50 flex justify-center items-center"
      />

      <div className="row-3 justify-between w-full">
        <div className="col-3 w-1/2 pr-4">
          <span className="inter-xs-normal-mb-200">Confirmed Bookings</span>
          <Achievements
            value={monthlyValue}
            icon={<HighestScoreIcon />}
            title="Monthly"
          />
          <Achievements
            value={eidValue}
            icon={<HighestScoreIcon />}
            title="Eid Sharing"
          />
          <Achievements
            value={totalValue}
            icon={<StreakIcon />}
            title="Total Bookings"
          />
        </div>
        <div className="border-r border-mb-50 mx-2"></div>
        <div className="col-3 w-1/2 pl-4">
          <span className="inter-xs-normal-mb-200">Booking Information</span>
          <Achievements
            value={formatAmount(amount.standard)}
            icon={<HighestScoreIcon />}
            title="Monthly"
          />
          <Achievements
            value={formatAmount(amount.basic)}
            icon={<HighestScoreIcon />}
            title="Eid Sharing"
          />

          <Achievements
            value={bookingEndsAt}
            icon={<StreakIcon />}
            title="Booking Closes"
          />
        </div>
      </div>
      {timeLeft && (
        <div className="col-2 place-items-center">
          <span className="inter-sm-medium-pry-500 pt-4">Eid Starts...</span>

          <div className="row-2 w-full justify-between">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center bg-pry-50 rounded-lg p-2 w-full"
              >
                <span className="inter-2xl-semibold-sec-500">{item.value}</span>
                <span className="inter-xs-normal-sec-200">{item.name}</span>
              </div>
            ))}
          </div>
          <div className="col-2 border-l-4 pl-3 border-pry-500 mt-4">
            <span className="inter-xs-medium-mb-200">
              “There are no days during which righteous deeds are more beloved
              to Allah than these days,” meaning the (first) ten days of Dhul-
              Hijjah...”
            </span>
            <span className="inter-xs-medium-sec-300 text-right w-full italic">
              “Ibn Majah 1727”
            </span>
          </div>
        </div>
      )}
    </Container>
  );
};

interface AchievementProp {
  title: string;
  icon: React.ReactNode;
  value: number | string;
}
const Achievements = ({ value, icon, title }: AchievementProp) => {
  return (
    <div className="p-2 md:p-4 row-3 md:row-6 items-center border-t border-mb-50">
      {icon}
      <div className="col-1">
        <span className="inter-xs-normal-mb-200">{title}</span>
        <span className="inter-sm-medium-mb-600">{value}</span>
      </div>
    </div>
  );
};

export interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

const formatTimeUnit = (value: number): string =>
  String(value).padStart(2, "0");

const getTimeLeft = (targetDate: string): TimeLeft | null => {
  const diff = new Date(targetDate).getTime() - new Date().getTime();

  if (diff <= 0) return null;

  return {
    days: formatTimeUnit(Math.floor(diff / (1000 * 60 * 60 * 24))),
    hours: formatTimeUnit(Math.floor((diff / (1000 * 60 * 60)) % 24)),
    minutes: formatTimeUnit(Math.floor((diff / (1000 * 60)) % 60)),
    seconds: formatTimeUnit(Math.floor((diff / 1000) % 60)),
  };
};

function getDisplaySlotValue(
  actualValue: number,
  minimumDisplayValue: number
): number {
  return actualValue < minimumDisplayValue ? minimumDisplayValue : actualValue;
}
