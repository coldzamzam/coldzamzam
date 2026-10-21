import localFont from "next/font/local";

export const laguSans = localFont({
  src: [
    {
      path: "../../public/font/lagu-sans/Lagu Sans Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/lagu-sans/Lagu Sans Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-lagu-sans",
  display: "swap",
});
