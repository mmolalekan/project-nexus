import type { Config } from "tailwindcss";
import tailwindPlugins from "./tailwind-plugins";

export default {
  content: [
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        bp: "992px",
        lbp: "1200px",
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
        amiri: ["var(--font-amiri)"],
      },
      colors: {
        // Primary Colors
        "pry-50": "#E6F5FA",
        "pry-100": "#B0DFEF",
        "pry-200": "#8AD0E8",
        "pry-300": "#54BADD",
        "pry-400": "#33ADD6",
        "pry-500": "#0098CC",
        "pry-600": "#008ABA",
        "pry-700": "#006C91",
        "pry-800": "#005470",
        "pry-900": "#004056",

        // Secondary Colors
        "sec-50": "#FEF3E6",
        "sec-100": "#FCD9B0",
        "sec-200": "#FAC78A",
        "sec-300": "#F8AE55",
        "sec-400": "#F79E34",
        "sec-500": "#F58601",
        "sec-600": "#DF7A01",
        "sec-700": "#AE5F01",
        "sec-800": "#874A01",
        "sec-900": "#673800",

        // Main Black colors
        "mb-50": "#E9E9E9",
        "mb-100": "#BBBBBB",
        "mb-200": "#9A9A9A",
        "mb-300": "#6C6C6C",
        "mb-400": "#4F4F4F",
        "mb-500": "#232323",
        "mb-600": "#202020",
        "mb-700": "#191919",
        "mb-800": "#131313",
        "mb-900": "#0F0F0F",

        // Success colors
        "sux-50": "#E8F9F0",
        "sux-100": "#B6EBCF",
        "sux-200": "#93E2B8",
        "sux-300": "#62D497",
        "sux-400": "#44CC83",
        "sux-500": "#15BF64",
        "sux-600": "#13AE5B",
        "sux-700": "#0F8847",
        "sux-800": "#0C6937",
        "sux-900": "#09502A",

        // Error colors
        "err-50": "#FCEAEE",
        "err-100": "#F6BECB",
        "err-200": "#F29EB2",
        "err-300": "#EC728E",
        "err-400": "#E85779",
        "err-500": "#E22D57",
        "err-600": "#CE294F",
        "err-700": "#A0203E",
        "err-800": "#7C1930",
        "err-900": "#5F1325",

        // Warning colors
        "warn-50": "#FFFBE6",
        "warn-100": "#FFF3B0",
        "warn-200": "#FFED8A",
        "warn-300": "#FFE554",
        "warn-400": "#FFE033",
        "warn-500": "#FFD800",
        "warn-600": "#E8C500",
        "warn-700": "#B59900",
        "warn-800": "#8C7700",
        "warn-900": "#6B5B00",

        // Information colors
        "info-50": "#E6EFFA",
        "info-100": "#B2CCEF",
        "info-200": "#8CB4E8",
        "info-300": "#5891DD",
        "info-400": "#387CD6",
        "info-500": "#065BCC",
        "info-600": "#0553BA",
        "info-700": "#044191",
        "info-800": "#033270",
        "info-900": "#032656",

        // Transparent Black colors
        "tb-10": "rgba(35, 35, 35, 0.1)",
        "tb-20": "rgba(35, 35, 35, 0.2)",
        "tb-30": "rgba(35, 35, 35, 0.3)",
        "tb-50": "rgba(35, 35, 35, 0.5)",

        // Transparent White colors
        "tw-10": "rgba(255, 255, 255, 0.1)",
        "tw-20": "rgba(255, 255, 255, 0.2)",
        "tw-30": "rgba(255, 255, 255, 0.3)",
        "tw-50": "rgba(255, 255, 255, 0.5)",

        // others
        white: "#FFFFFF",
        black: "#232323",
        "modal-b": "#E8E8E9",
        "black-500": "#14181F",
        "soft-gray": "#F4F4F4",
        "light-gray": "#F9F9F9",
        other: "#F8FAFB",
        stroke1: "#D9D9D9", //stroke is a reserved keyword
      },
    },
  },

  plugins: [tailwindPlugins],
} satisfies Config;
