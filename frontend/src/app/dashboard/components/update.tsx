import { ModalKeys } from "@/providers/stateProvider/type";
import { useGlobalState } from "@/providers/stateProvider/provider";

export const Update = () => {
  const { globalState, globalDispatch } = useGlobalState();

  const toggleModal = (field: ModalKeys) =>
    globalDispatch({ type: "TOGGLE_MODAL", field });

  const text =
    !globalState.profile?.phone_number || !globalState.profile?.address
      ? {
          title: "Complete Your Profile",
          subtitle:
            "Keep your information up to date to ensure a smooth experience and accurate account management.",
          button: "Update",
          action: () => toggleModal("profileModal"),
        }
      : !globalState.profile?.account_name
      ? {
          title: "Get Paid for Your Referrals",
          subtitle:
            "To send you your referral earnings, we need your bank account details. Your information is used only for payouts.",
          button: "Update",
          action: () => toggleModal("referralModal"),
        }
      : null;
  if (globalState.profile?.phone_number && globalState.profile?.account_name)
    return null;
  return (
    <div className="fixed top-0 left-0 font-inter row-5 items-center justify-center md:row-25 w-full py-3 px-6 bg-sux-100">
      <div className="col-2">
        <span className="text-sm font-bold text-black">{text?.title}</span>
        <span className="text-[10px] md:text-xs font-medium text-mb-400">
          {text?.subtitle}
        </span>
      </div>
      <button
        onClick={text?.action}
        className="text-xs font-bold text-white bg-pry-500 rounded-full px-6 py-2 w-fit"
      >
        {text?.button}
      </button>
    </div>
  );
};
