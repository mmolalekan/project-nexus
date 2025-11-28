/* eslint-disable react-hooks/static-components */
import { Button, Modal } from "../components/components";
import { CloseIcon, SignOutIcon } from "../icons";
import { logout } from "@/shared/utils/auth";

export const SignOut = ({ close }: { close: () => void }) => {
  const Body = () => (
    <span className="inter-base-normal-black-500">
      Are you sure you want to sign out? You will need to sign in again later.
    </span>
  );

  const Footer = () => (
    <div className="row-4 justify-between">
      <Button
        text="Cancel"
        type="cancel"
        icon={<CloseIcon />}
        onClick={close}
      />
      <Button
        text="Sign Out"
        type="danger"
        icon={<SignOutIcon color="white" />}
        onClick={logout}
      />
    </div>
  );

  return (
    <Modal
      header={{ title: "Sign Out", icon: <SignOutIcon color="red" /> }}
      body={<Body />}
      footer={<Footer />}
      close={close}
    />
  );
};
