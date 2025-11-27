import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneInputProps {
  label: string;
  phone: string;
  required?: boolean;
  onChange?: (field: string, value: string) => void;
}

export const PhoneNumber = ({ phone, onChange }: PhoneInputProps) => {
  return (
    <PhoneInput
      value={phone}
      onChange={(e) => onChange && onChange("phone_number", e)}
      inputProps={{
        name: "phone",
        required: true,
        autoFocus: false,
      }}
      country={"ng"}
      enableSearch={true}
      disableSearchIcon={true}
      inputStyle={{
        borderRadius: "6px",
        height: "44px",
        width: "100%",
        padding: "16px 16px 16px 48px",
        fontSize: "14px",
        color: "#4B5563",
      }}
      buttonStyle={{
        backgroundColor: "#f3f4f6",
        border: "1px solid #D0D5DD",
        borderRadius: "6px 0 0 6px",
      }}
      containerStyle={{
        width: "100%",
        height: "44px",
      }}
      searchStyle={{
        width: "100%",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
      }}
    />
  );
};
