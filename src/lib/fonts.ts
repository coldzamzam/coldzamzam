import localFont from "next/font/local";

export const laguSans = localFont({
  src: [
    {
      path: "../../public/font/lagu-sans/Lagu Sans Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/font/lagu-sans/Lagu Sans Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/lagu-sans/Lagu Sans Medium.otf",
      weight: "500",
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

export const solarisScript = localFont({
  src: "../../public/font/solaris-3-script/Solaris-3 Script.otf",
  variable: "--font-solaris-script",
  display: "swap",
});
