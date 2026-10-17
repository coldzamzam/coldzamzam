import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { laguSans } from "@/lib/fonts";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

import CustomCursor from "@/components/shared/CustomCursor";

export const metadata: Metadata = {
  title: "Aqsa Zamzami - Portfolio",
  description: "Portfolio of Aqsa Zamzami, a fullstack developer and software engineer. Selected projects, experience, and tech stack.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${laguSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans relative overflow-x-hidden bg-[#050810] text-slate-100">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
