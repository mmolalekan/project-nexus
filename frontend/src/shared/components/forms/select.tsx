import { DropDown } from "@/shared/allIcons";

interface SelectProps {
  data?: { [key: string]: string | number };
  list?: { id: number; name: string }[];
  required?: boolean;
  label: string;
  disabled?: boolean;
  value: string | number | null;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Select = ({
  data,
  list,
  label,
  disabled,
  value,
  onChange,
}: SelectProps) => {
  return (
    <div className="relative w-full">
      <select
        className="appearance-none px-4 w-full h-11 rounded-md bg-white border border-mb-50 inter-xs-normal-mb-500 placeholder:text-mb-300 pr-10 cursor-pointer"
        id={label}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
      >
        <option value="" disabled>
          Select {label}
        </option>
        {data &&
          Object.entries(data).map(([code, item]) => (
            <option key={code} value={item}>
              {item}
            </option>
          ))}
        {list &&
          list.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
      </select>
      <span
        className="absolute right-4 top-1/2 transform -translate-y-1/2"
        aria-hidden="true"
      >
        <DropDown />
      </span>
    </div>
  );
};
