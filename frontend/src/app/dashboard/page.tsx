/* eslint-disable react-hooks/exhaustive-deps */
"use client";

// Dashboard components
import { Info } from "./components/info";
import { Update } from "./components/update";
import { Streak } from "./components/countdown";
import { Bookings } from "./components/bookings";
// Modal components
import { SignOut } from "./modals/signOut";
import { Profile } from "./modals/profile";
import { Referral } from "./modals/referral";
import { BookSlot } from "./modals/slot/slots";
import { HelpCenter } from "./modals/helpCenter";
// imports
import { useEffect } from "@/shared/common";
import { ModalKeys } from "@/providers/stateProvider/type";
import { useGlobalState } from "@/providers/stateProvider/provider";
import { useGlobalActions } from "@/providers/stateProvider/useGlobal";
// Navigation components
import { Sidebar, MobileSidebar, SnackBar } from "./components/navigations";

const Dashboard = () => {
  const { getProfile, getBookingSummary, getMyBookings } = useGlobalActions();
  const { globalState, globalDispatch } = useGlobalState();
  const {
    profile,
    isLoading,
    myBookings,
    // modals
    helpModal,
    profileModal,
    signOutModal,
    referralModal,
    bookSlotModal,
  } = globalState;

  useEffect(() => {
    getProfile();
    getBookingSummary();
    getMyBookings();
  }, []);

  const toggleModal = (field: ModalKeys) =>
    globalDispatch({ type: "TOGGLE_MODAL", field });

  return (
    <div className="flex flex-row h-screen w-full">
      <SnackBar />
      <MobileSidebar />

      <Sidebar />
      <div className="flex flex-col justify-between overflow-auto w-full">
        <Update />
        <div className="col-6 bp:row-6 p-8 w-full">
          <Streak />
          <div className="col-6 w-full">
            <Info profile={profile} loading={isLoading} />
            <Bookings
              myBookings={myBookings}
              bookAction={() => toggleModal("bookSlotModal")}
            />
          </div>
        </div>
      </div>

      {/* modals */}
      {bookSlotModal && <BookSlot close={() => toggleModal("bookSlotModal")} />}
      {referralModal && <Referral close={() => toggleModal("referralModal")} />}
      {profileModal && <Profile close={() => toggleModal("profileModal")} />}
      {signOutModal && <SignOut close={() => toggleModal("signOutModal")} />}
      {helpModal && <HelpCenter close={() => toggleModal("helpModal")} />}
    </div>
  );
};

export default Dashboard;
