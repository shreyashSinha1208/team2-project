import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Inter} from "next/font/google";

import { Providers } from "@/context/ThemeProvider";
export const metadata: Metadata = {
  title: "",
  description: "",
};

const poppins = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // choose weights you need
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
