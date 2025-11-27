interface TitleProps {
  title: string;
  subtitle: string;
  align?: string;
}

export const HeadingTitles = ({ title, subtitle, align }: TitleProps) => {
  return (
    <div className={`col-3 justify-center items-center bp:items-${align}`}>
      <span
        className={`inter-2xl-bold-mb-500 text-center bp:text-${align} leading[100%]`}
      >
        {title}
      </span>
      <span className="inter-sm-normal-mb-400">{subtitle}</span>
    </div>
  );
};
