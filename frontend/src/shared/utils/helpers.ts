import { toast } from "@/shared/common";

export const handleCopy = (text?: string) => {
  if (!text) {
    toast.error("No text to copy");
    return;
  }
  navigator.clipboard.writeText(text);
  toast.success("copied");
};
