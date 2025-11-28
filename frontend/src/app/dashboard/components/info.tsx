/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from "./components";
import { LoadingState } from "@/shared/allIcons";
import { UserProfile } from "@/providers/stateProvider/type";

interface InfoProps {
  profile: UserProfile | null;
  loading: boolean;
}

export const Info = ({ profile, loading }: InfoProps) => {
  if (loading) return <LoadingState />;
  return (
    <Container title="Referral Information" padding="p-6">
      <div className="col-3">
        <div className="row-4 place-items-center overflow-x-auto">
          <SprintScores title="Code" value={profile?.referral_code} />
          <SprintScores
            title="Earnings"
            value={profile?.total_referral_earnings}
          />
          <SprintScores
            title="Usage"
            value={Number(profile?.total_referral_earnings) / 2000}
          />
        </div>
      </div>
    </Container>
  );
};

const SprintScores = ({ title, value }: { title: string; value?: any }) => {
  return (
    <div
      className={`min-w-[120px] bg-sec-100/60 p-3 rounded-md col-1 place-items-center ${
        title === "Earnings" && "border border-pry-400 shadow-xl"
      }`}
    >
      <span className="inter-xs-medium-sec-500">{title}</span>
      <span className="inter-xl-semibold-pry-600">{value}</span>
    </div>
  );
};
