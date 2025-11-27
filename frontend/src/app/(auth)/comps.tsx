// import { useContent } from "@/providers/ContentProvider";
import { formatCountdown } from "./utils";
import { Link, Image } from "@/shared/common";
import { PageLoadingState } from "@/shared/icons/status";
import { CountdownIcon, LeftArrow } from "@/shared/allIcons";

export const AuthContainer = (prop: {
  isLoading?: boolean;
  children: React.ReactNode;
  goback?: { title: string; link: string };
}) => {
  return (
    <div className="col-4 min-w-64">
      {prop.goback && (
        <Link href={prop.goback.link} className="inter-sm-medium-mb-100 row-2">
          <LeftArrow />
          {prop.goback.title}
        </Link>
      )}
      {prop.isLoading ? <PageLoadingState /> : prop.children}
    </div>
  );
};

export const QurbaanLogo = () => {
  return (
    <Link href="/">
      <Image
        src="/images/qurbaanLogo.png"
        alt="qurbaan logo"
        width={140}
        height={67}
      />
    </Link>
  );
};

interface FooterProps {
  text: string;
  link: string;
  title: string;
  align?: string;
}
export const Footer = (props: FooterProps) => {
  return (
    <div className={`flex items-center self-${props.align} bp:self-start`}>
      <span className="inter-sm-normal-mb-400">{props.text}</span>
      <Link href={props.link} className="px-2 inter-sm-medium-sec-500">
        {props.title}
      </Link>
    </div>
  );
};

interface CountdownProps {
  text: string;
  countdown: number | null;
  bgColor: string;
}

export const Countdown = (props: CountdownProps) => {
  if (props.countdown === null) return null;

  return (
    <div
      className={`w-full p-1 row-1 items-center ${props.bgColor} justify-center rounded-sm`}
    >
      <CountdownIcon />
      <span className="inter-base-normal-sec-400 text-center">
        {props.text} {formatCountdown(props.countdown)} minutes
      </span>
    </div>
  );
};
