import type { Metadata } from "next";
import { DM_Serif_Text } from "next/font/google";
import RootProviders from "./providers";
import "../styles/globals.css";

const serifText = DM_Serif_Text({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "----------", // TODO
  description: "----------", // TODO
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body
        className={`${serifText.variable} h-full min-h-screen flex flex-col justify-between scrollbar antialiased`}
      >
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
