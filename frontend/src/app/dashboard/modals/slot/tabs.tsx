import { isReferrerValid } from "./api";
import { slotsGroup, formatAmount } from "./utils";
import { Booking, BodyProps, BookingAction } from "./type";
import { Input, Select, HeadingTitles } from "@/shared/allComps";
import { Button, ToggleSwitch } from "../../components/components";

export const PayNow = ({ state, dispatch }: BodyProps) => {
  const handleFieldChange = (field: keyof Booking, payload: string) => {
    dispatch({ type: "SET_FIELD", field, payload });
    // reset referrer when referral code changes
    if (field === "referral_code")
      dispatch({ type: "SET_FIELD", field: "referrer", payload: null });
  };

  return (
    <div className="col-4">
      <div className="row-4 w-full">
        <Input
          type="text"
          placeholder="Referral Code (Optional)"
          value={state.referral_code}
          onChange={(e) => {
            handleFieldChange("referral_code", e.target.value);
          }}
        />
        <div className="w-18">
          <Button
            text="Confirm"
            type="button"
            onClick={() => {
              isReferrerValid(state.referral_code, dispatch);
              dispatch({ type: "SET_FIELD", field: "referrer", payload: null });
            }}
          />
        </div>
      </div>
      {state.referrer?.referrer_name && (
        <span className="italic inter-sm-normal-sec-600">
          {state.referrer?.referrer_name} referred you!
        </span>
      )}

      <span className="inter-sm-bold-pry-500">
        Selected Package: {state.package_type} (
        {formatAmount(state.budget || 0)})
      </span>

      <Select
        label="Number of Slots"
        value={state.slots ?? ""}
        list={slotsGroup ?? []}
        onChange={(e) => {
          const slots = parseInt(e.target.value);
          dispatch({
            type: "SET_FIELD",
            field: "slots",
            payload: slots,
          });
        }}
      />

      <ToggleSwitch
        state={state.delivery_option}
        dispatch={() =>
          dispatch({
            type: "SET_FIELD",
            field: "delivery_option",
            payload: !state.delivery_option,
          })
        }
        text="Do you want it delivered to you?"
      />

      <div className="col-1 items-end">
        <span className="inter-xs-medium-pry-400">
          Amount:{" "}
          {state.slots && formatAmount(state.slots * (state?.budget || 0) || 0)}
        </span>

        <span className="inter-xs-medium-pry-400">
          Delivery Fee:{" "}
          {state.delivery_option ? formatAmount(3000) : formatAmount(0)}
        </span>

        <span className="inter-sm-bold-pry-600">
          Pay:{" "}
          {formatAmount(
            (state.slots ?? 0) * (state.budget ?? 0) +
              (state.delivery_option ? 3000 : 0)
          )}
        </span>
      </div>
      <span className="inter-xs-bold-mb-200 italic">
        Note: You may be prompted to pay to &quot;Evolace FLW&quot; Account —
        this is correct and your payment is secure. By continuing, you agree to
        our{" "}
        <a
          className="text-sec-500 underline font-semibold"
          href="/terms"
          target="_blank"
          rel="noreferrer"
        >
          terms and conditions.
        </a>
      </span>
    </div>
  );
};

interface BudgetProps {
  dispatch: React.Dispatch<BookingAction>;
}
export const ChooseBudget = ({ dispatch }: BudgetProps) => {
  const handleSelectBudget = (price: number, title: string) => {
    dispatch({ type: "SET_FIELD", field: "package_type", payload: title });
    dispatch({ type: "SET_FIELD", field: "budget", payload: price });
  };
  return (
    <div className="col-4">
      <HeadingTitles title="Choose a Package" subtitle="" />
      <div className="row-2 md:row-6 items-center w-full justify-center">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="col-4 justify-between py-4 px-2 md:p-4 border-4 border-sec-100 bg-gradient-to-b from-white to-pry-200 rounded-lg hover:shadow-xl transition-shadow duration-200 hover:bg-sec-50 cursor-pointer"
            onClick={() => handleSelectBudget(plan.price, plan.id)}
          >
            <div>
              <h3 className="inter-sm-bold-pry-400">{plan.title}</h3>
              <span className="inter-xs-bold-mb-300">{plan.size}</span>
            </div>
            <div>
              <span className="inter-base-bold-black text-nowrap">
                {formatAmount(plan.price)}
              </span>
              <span className="inter-sm-bold-mb-300">/slot</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const plans = [
  {
    id: "monthly",
    title: "Monthly",
    price: 25000,
    size: "4-5kg",
  },
  {
    id: "basic",
    title: "Eid Sharing",
    price: 85000,
    size: "10-12kg",
  },
];
