"use client";

import { useEffect, useState } from "@/shared/common";
import { UpArrow } from "@/shared/allIcons";

const ScrollUpButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 800) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <button
      className="fixed bottom-7 right-7 z-50 size-16 md:size-20 rounded-full flex justify-center items-center p-6 hover:bg-gray-200/80 bg-gray-200 transition duration-300"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <UpArrow />
    </button>
  );
};

export default ScrollUpButton;
