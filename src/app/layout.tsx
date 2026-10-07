import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { laguSans, solarisScript } from "@/lib/fonts";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

import CustomCursor from "@/components/shared/CustomCursor";

export const metadata: Metadata = {
  title: "Aqsa Zamzami // Fullstack Developer Portfolio",
  description: "Portfolio of Aqsa Zamzami, a fullstack developer and software engineer. Projects, experience, and tech stack in an interactive game-UI inspired experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${laguSans.variable} ${solarisScript.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans relative overflow-x-hidden bg-[#050810] text-slate-100">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
