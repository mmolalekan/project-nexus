/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal } from "../components/components";
import { CloseIcon, SaveIcon, ReferralIcon } from "../icons";
import { Input } from "@/shared/allComps";
import { useGlobalState } from "@/providers/stateProvider/provider";
import { handleCopy } from "@/shared/allUtils";
import { useGlobalActions } from "@/providers/stateProvider/useGlobal";
import { useState } from "@/shared/common";
import { ModalKeys, UserProfile } from "@/providers/stateProvider/type";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { Facebook, Twitter, WhatsApp, Telegram } from "@/shared/allIcons";

export const Referral = ({ close }: { close: () => void }) => {
  const { globalState } = useGlobalState();
  const { updateProfile } = useGlobalActions();
  const { profile } = globalState;

  const [payout, setPayout] = useState({
    account_number: profile?.account_number ?? null,
    account_name: profile?.account_name ?? null,
    bank_name: profile?.bank_name ?? null,
  });

  const handleFieldChange = (
    field: keyof typeof payout,
    payload: string | null
  ) => {
    setPayout((prev) => ({
      ...prev,
      [field]: payload,
    }));
  };

  return (
    <Modal
      loading={globalState.isLoading}
      header={{ title: "Referral", icon: <ReferralIcon /> }}
      body={
        <ReferralBody
          profile={profile}
          payout={payout}
          handleFieldChange={handleFieldChange}
        />
      }
      footer={
        <ReferralFooter
          close={close}
          payout={payout}
          updateProfile={updateProfile}
        />
      }
      close={close}
    />
  );
};

interface ReferralBodyProps {
  payout: {
    account_number: string | null;
    account_name: string | null;
    bank_name: string | null;
  };
  profile: UserProfile | null;
  handleFieldChange: (
    field: keyof ReferralBodyProps["payout"],
    payload: string | null
  ) => void;
}

const ReferralBody = ({
  payout,
  profile,
  handleFieldChange,
}: ReferralBodyProps) => (
  <div className="col-4">
    <span className="inter-sm-semibold-mb-500">
      Invite your friends to Qurbaan. Get #2,000 when a slot is booked with your
      referral code below.
    </span>
    <div className="col-4 border-b items-center pb-4 w-full">
      <div className="row-4 w-full border border-dashed border-gray-300 rounded-lg">
        <div className="row-2 w-full justify-between">
          <span className="inter-lg-bold-pry-600 p-2">
            {profile?.referral_code}
          </span>
          <button
            onClick={() => handleCopy(profile?.referral_code)}
            className="inter-sm-medium-white bg-sec-400 p-2 text-center h-full w-20 rounded-r-lg border"
          >
            Copy
          </button>
        </div>
      </div>
      <span className="inter-sm-medium-mb-300">or</span>
      <ReferralShare referral_code={profile?.referral_code || ""} />
      <div className="row-4 items-center justify-center border-t pt-4">
        <span className="inter-xs-medium-mb-300">
          Want to keep your referrals engaged? Join our WhatsApp group for daily
          updates and content!
        </span>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://chat.whatsapp.com/IcXA30h1eBwKIoKDumHxla"
          className="inter-xs-bold-white text-center bg-sec-400 py-2 px-4 h-fit rounded-lg"
        >
          Join
        </a>
      </div>
      {/* <ReferrerCard referralCode={profile?.referral_code} /> */}
    </div>

    <div className="col-4">
      <span className="inter-sm-medium-mb-100">Cashout Details</span>
      <Input
        type="text"
        placeholder="Account Number"
        value={payout.account_number || ""}
        onChange={(e) => handleFieldChange("account_number", e.target.value)}
      />
      <Input
        type="text"
        placeholder="Account Name"
        value={payout.account_name || ""}
        onChange={(e) => handleFieldChange("account_name", e.target.value)}
      />
      <Input
        type="text"
        placeholder="Bank Name"
        value={payout.bank_name || ""}
        onChange={(e) => handleFieldChange("bank_name", e.target.value)}
      />
    </div>
  </div>
);

interface ReferralFooterProps {
  close: () => void;
  payout: {
    account_number: string | null;
    account_name: string | null;
    bank_name: string | null;
  };
  updateProfile: (payout: any, field: ModalKeys) => void;
}

const ReferralFooter = ({
  close,
  payout,
  updateProfile,
}: ReferralFooterProps) => (
  <div className="row-4 justify-between">
    <Button text="Cancel" type="cancel" icon={<CloseIcon />} onClick={close} />
    <Button
      text="Save"
      type="button"
      icon={<SaveIcon />}
      onClick={() => updateProfile(payout, "referralModal")}
    />
  </div>
);

export const ReferrerCard = ({ referralCode }: { referralCode?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current);
      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = `${name}-referral-card.png`;
      link.click();
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      <div ref={cardRef} className="p-6 text-center">
        <h2 className="text-xl font-bold mb-2 text-gray-800">Referral Card</h2>
        <p className="text-gray-600 mb-4">Code: {referralCode}</p>
        <p className="text-sm text-gray-500">
          Share this card on your socials!
        </p>
      </div>
      <div className="px-6 pb-4">
        <button
          onClick={handleDownload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Download Card
        </button>
      </div>
    </div>
  );
};

const ReferralShare = ({ referral_code }: { referral_code: string }) => {
  const message = `You can get a share of a cow by booking a slot with Qurbaan using my referral code ${referral_code} — affordable, hassle-free, and Shariah-compliant. Tap here: https://qurbaan.com.ng
 to get started!`;
  const referralUrl = "https://qurbaan.com.ng";

  const shareUrls = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      message
    )}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(
      referralUrl
    )}&text=${encodeURIComponent(message)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      referralUrl
    )}`, // Facebook needs a full URL
  };

  return (
    <div className="row-10 w-full items-center justify-center">
      <a
        className="hover:bg-pry-100 p-1 rounded-full"
        href={shareUrls.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsApp />
      </a>
      <a
        className="hover:bg-pry-100 p-1 rounded-full"
        href={shareUrls.twitter}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Twitter />
      </a>
      <a
        className="hover:bg-pry-100 p-1 rounded-full"
        href={shareUrls.telegram}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Telegram />
      </a>
      <button
        className="hover:bg-pry-100 p-1 rounded-full"
        onClick={() => handleCopy(message)}
      >
        <Facebook />
      </button>
    </div>
  );
};
