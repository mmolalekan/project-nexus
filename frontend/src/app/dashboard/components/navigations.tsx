import {
  HelpIcon,
  BookingIcon,
  ReferralIcon,
  LogoutIcon,
  SnackBarIcon,
  CloseIcon,
} from "../icons";
import { Image } from "@/shared/common";
import { ModalKeys, StateAction } from "@/providers/stateProvider/type";
import { useGlobalState } from "@/providers/stateProvider/provider";

const toggleModal = (dispatch: React.Dispatch<StateAction>, field: ModalKeys) =>
  dispatch({ type: "TOGGLE_MODAL", field });

interface NavProp {
  acronym?: string;
  name: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | string;
  state: ModalKeys;
}

const navigations: NavProp[] = [
  { name: "Book Slot", icon: BookingIcon, state: "bookSlotModal" },
  { name: "Referral", icon: ReferralIcon, state: "referralModal" },
  { name: "Help Centre", icon: HelpIcon, state: "helpModal" },
  { name: "Sign Out", icon: LogoutIcon, state: "signOutModal" },
  { acronym: "AO", name: "muhaymin Olalekan", icon: "", state: "profileModal" },
];

export const Sidebar = () => {
  const { globalState, globalDispatch } = useGlobalState();
  return (
    <div className="hidden sm:flex w-52 bg-white h-screen flex-col py-4">
      <button className="py-6 px-4 grid w-full place-items-center">
        <Image width={75} height={75} src="/images/logo.png" alt="logo" />
      </button>
      <div className="p-4 col-3 h-full">
        {navigations.slice(0, 3).map((nav, index) => {
          const Icon = nav.icon;
          return (
            <button
              key={index}
              onClick={() => toggleModal(globalDispatch, nav.state)}
              className="group rounded-lg py-2 px-3 row-2 items-center text-mb-300 hover:text-white hover:bg-pry-500"
            >
              <Icon />
              <span className="inter-sm-bold-mb-300 group-hover:text-white">
                {nav.name}
              </span>
            </button>
          );
        })}
      </div>
      <button
        onClick={() => toggleModal(globalDispatch, navigations[3].state)}
        className="group p-4 row-2 items-center inter-sm-bold-err-300"
      >
        <LogoutIcon />
        <span>{navigations[3].name}</span>
      </button>
      <button
        onClick={() => toggleModal(globalDispatch, navigations[4].state)}
        className="border-t group rounded-lg py-2 px-3 row-2 items-center text-mb-300 hover:text-white hover:bg-pry-500"
      >
        <span className="rounded-full bg-pry-500 p-1 inter-xl-bold-white">
          {globalState.profile?.first_name[0]}
          {globalState.profile?.last_name[0]}
        </span>
        <span className="inter-sm-bold-mb-300 group-hover:text-white text-nowrap text-ellipsis overflow-hidden">
          {globalState.profile?.first_name}
        </span>
      </button>
    </div>
  );
};

export const MobileSidebar = () => {
  const { globalState, globalDispatch } = useGlobalState();
  const isNavVisible = globalState.nav;

  return (
    <div
      className={`sm:hidden fixed top-0 left-0 z-40 h-screen w-52 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isNavVisible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        <SnackBar />
        <button className="py-6 px-4 grid w-full place-items-center">
          <Image width={75} height={75} src="/images/logo.png" alt="logo" />
        </button>
        <div className="p-4 col-3 h-full">
          {navigations.slice(0, 3).map((nav, index) => {
            const Icon = nav.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  toggleModal(globalDispatch, nav.state);
                  globalDispatch({ type: "SET_NAV" }); // Close menu
                }}
                className="group rounded-lg py-2 px-3 row-2 items-center text-mb-300 hover:text-white hover:bg-pry-500"
              >
                <Icon />
                <span className="inter-sm-bold-mb-300 group-hover:text-white">
                  {nav.name}
                </span>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => {
            toggleModal(globalDispatch, navigations[3].state);
            globalDispatch({ type: "SET_NAV" });
          }}
          className="group p-4 row-2 items-center inter-sm-bold-err-300"
        >
          <LogoutIcon />
          <span>{navigations[3].name}</span>
        </button>
        <button
          onClick={() => {
            toggleModal(globalDispatch, navigations[4].state);
            globalDispatch({ type: "SET_NAV" });
          }}
          className="border-t group rounded-lg py-2 px-3 row-2 items-center text-mb-300 hover:text-white hover:bg-pry-500"
        >
          <span className="rounded-full bg-pry-500 p-1 inter-xl-bold-white">
            {globalState.profile?.first_name[0]}
            {globalState.profile?.last_name[0]}
          </span>
          <span className="inter-sm-bold-mb-300 group-hover:text-white text-nowrap text-ellipsis overflow-hidden">
            {globalState.profile?.first_name}
          </span>
        </button>
      </div>
    </div>
  );
};

export const SnackBar = () => {
  const { globalState, globalDispatch } = useGlobalState();
  return (
    <button
      onClick={() => globalDispatch({ type: "SET_NAV" })}
      className={`sm:hidden fixed ${
        globalState.nav ? "top-3 left-3" : "bottom-5 left-1/2 -translate-x-1/2"
      } p-3 bg-pry-100 shadow-lg rounded-full flex items-center`}
    >
      {globalState.nav ? <CloseIcon /> : <SnackBarIcon />}
    </button>
  );
};
