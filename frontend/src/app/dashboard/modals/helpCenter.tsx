/* eslint-disable react-hooks/static-components */
import { Faqs } from "./Faqs";
import { ReferralIcon } from "../icons";
import { Modal } from "../components/components";

export const HelpCenter = ({ close }: { close: () => void }) => {
  const Body = () => (
    <div className="max-h-[calc(100vh-200px)] overflow-auto">
      <Faqs />
      <div className="col-4">
        <p className="inter-sm-normal-mb-300">
          If you have further questions, or want to report a bug, use the
          feedback form or reach out to us at qurbaan.ng@gmail.com
        </p>
        <a
          className="px-4 py-2 bg-pry-500 inter-sm-bold-white rounded-lg w-fit"
          target="_blank"
          rel="noopener noreferrer"
          href="https://docs.google.com/forms/d/e/1FAIpQLSc1j3FkXi21u323jc_TdUb6r37e78EGIMD8UGoVpMB8MBxPcg/viewform?usp=sharing&ouid=113129147092737260485"
        >
          Feedback Form
        </a>
      </div>
    </div>
  );

  return (
    <Modal
      header={{ title: "Help center", icon: <ReferralIcon /> }}
      body={<Body />}
      close={close}
    />
  );
};
