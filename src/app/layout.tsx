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
  metadataBase: new URL("https://aqs.my.id"),
  title: {
    default: "Aqsa Zamzami · Fullstack Engineer & Software Developer",
    template: "%s · Aqsa Zamzami",
  },
  description:
    "Interactive portfolio of Aqsa Zamzami, a Fullstack Engineer and Software Developer based in Indonesia building reliable backend architectures, relational databases, and responsive web and mobile applications.",
  keywords: [
    "Aqsa Zamzami",
    "coldzamzam",
    "Fullstack Engineer",
    "Software Developer",
    "Indonesia",
    "Next.js",
    "Laravel",
    "Flutter",
    "TypeScript",
    "PostgreSQL",
  ],
  authors: [{ name: "Aqsa Zamzami", url: "https://aqs.my.id" }],
  creator: "Aqsa Zamzami",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aqs.my.id",
    siteName: "Aqsa Zamzami Portfolio",
    title: "Aqsa Zamzami · Fullstack Engineer & Software Developer",
    description:
      "Building reliable backend architectures, well-structured relational databases, and responsive web and mobile applications.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aqsa Zamzami · Fullstack Engineer & Software Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aqsa Zamzami · Fullstack Engineer & Software Developer",
    description:
      "Building reliable backend architectures, well-structured relational databases, and responsive web and mobile applications.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.svg", sizes: "96x96", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
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
