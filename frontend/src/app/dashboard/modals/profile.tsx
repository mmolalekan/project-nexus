/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal } from "../components/components";
import { CloseIcon, SaveIcon } from "../icons";
import { Input, Select } from "@/shared/allComps";
import { PhoneNumber } from "@/shared/components/forms/phoneInput";
import { useGlobalActions } from "@/providers/stateProvider/useGlobal";
import { useState } from "@/shared/common";
import { useGlobalState } from "@/providers/stateProvider/provider";
import { ModalKeys } from "@/providers/stateProvider/type";

const genderGroup = { male: "Male", Female: "Female" };
const locationGroup = { location: "Nigeria" };

export const Profile = ({ close }: { close: () => void }) => {
  const { globalState } = useGlobalState();
  const { updateProfile } = useGlobalActions();
  const { profile } = globalState;

  const [localProfile, setLocalProfile] = useState({
    first_name: profile?.first_name ?? null,
    last_name: profile?.last_name ?? null,
    email: profile?.email ?? null,
    phone_number: profile?.phone_number ?? null,
    address: profile?.address ?? null,
    city: profile?.city ?? null,
    gender: profile?.gender ?? null,
  });

  const handleFieldChange = (
    field: keyof typeof localProfile | string,
    payload: string | null
  ) => {
    setLocalProfile((prev) => ({
      ...prev,
      [field]: payload,
    }));
  };

  return (
    <Modal
      loading={globalState.isLoading}
      header={{ title: "Profile" }}
      body={
        <ProfileBody
          localProfile={localProfile}
          handleFieldChange={handleFieldChange}
        />
      }
      footer={
        <ProfileFooter
          close={close}
          localProfile={localProfile}
          updateProfile={updateProfile}
        />
      }
      close={close}
    />
  );
};

interface ProfileBodyProps {
  localProfile: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone_number: string | null;
    address: string | null;
    city: string | null;
    gender: string | null;
  };
  handleFieldChange: (field: string, payload: string | null) => void;
}

const ProfileBody = ({ localProfile, handleFieldChange }: ProfileBodyProps) => (
  <div className="col-4">
    <Input
      type="text"
      placeholder="First Name"
      value={localProfile.first_name || ""}
      onChange={(e) => handleFieldChange("first_name", e.target.value)}
    />
    <Input
      type="text"
      placeholder="Last name"
      value={localProfile.last_name || ""}
      onChange={(e) => handleFieldChange("last_name", e.target.value)}
    />
    <Input
      type="email"
      disabled
      placeholder="Email"
      value={localProfile.email || ""}
      onChange={(e) => handleFieldChange("email", e.target.value)}
    />
    <PhoneNumber
      label="Phone Number"
      phone={localProfile.phone_number || ""}
      onChange={handleFieldChange}
    />
    <Select
      label="Gender"
      value={localProfile.gender ?? ""}
      data={genderGroup}
      onChange={(e) => handleFieldChange("gender", e.target.value)}
    />
    <Input
      type="text"
      placeholder="Address"
      value={localProfile.address || ""}
      onChange={(e) => handleFieldChange("address", e.target.value)}
    />
    <Select
      label="city"
      value={localProfile.city ?? ""}
      data={locationGroup}
      onChange={(e) => handleFieldChange("city", e.target.value)}
    />
  </div>
);

interface ProfileFooterProps {
  close: () => void;
  localProfile: Record<string, any>;
  updateProfile: (profile: any, field: ModalKeys) => void;
}

const ProfileFooter = ({
  close,
  localProfile,
  updateProfile,
}: ProfileFooterProps) => (
  <div className="row-4 justify-between">
    <Button text="Cancel" type="cancel" icon={<CloseIcon />} onClick={close} />
    <Button
      text="Save"
      type="button"
      icon={<SaveIcon />}
      onClick={() => updateProfile(localProfile, "profileModal")}
    />
  </div>
);
