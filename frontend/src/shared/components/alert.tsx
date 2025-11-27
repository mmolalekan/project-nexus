/* eslint-disable @typescript-eslint/no-explicit-any */
import { HeadingTitles, Button } from "@/shared/allComps";
import { PageHeaderIcon } from "./headerIcon";
import { QurbaanLogo } from "@/app/(auth)/comps";
import { PaymentStatus } from "@/app/payment-complete/page";

interface LevelAssignedProps {
  status: PaymentStatus["status"];
  title: string;
  subtitle: string;
  CTA: string;
  onClick: any;
}

export const Alert = (props: LevelAssignedProps) => {
  const { title, subtitle, CTA, onClick, status } = props;
  return (
    <div className="fixed inset-0 bg-white bg-opacity-100 flex items-center justify-center z-40">
      <div className="m-14 p-14 rounded-xl size-fit bg-white col-10 flex flex-col items-center">
        <div className="col-28 place-items-center">
          <QurbaanLogo />
          <div className="col-20 place-items-center text-center">
            <PageHeaderIcon status={status} />
            <HeadingTitles title={title} subtitle={subtitle} />
          </div>
        </div>
        <div className="w-72">
          <Button text={CTA} onClick={onClick} />
        </div>
      </div>
    </div>
  );
};
