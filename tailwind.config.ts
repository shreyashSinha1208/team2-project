import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    zIndex: {
      ModalOverlay: "1000",
      ModalOverlayParent: "1005",
      ModalBody: "1020",
      ToolTip: "1110",
      NavBar: "999",
      Highest: "1100",
    },
  },
  plugins: [],
};
export default config;
