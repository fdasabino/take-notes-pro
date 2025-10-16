import { Anaheim, Nunito, Doto } from "next/font/google";

export const anaheim = Anaheim({
  subsets: ["latin"],
  variable: "--font-anaheim",
});

export const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const doto = Doto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-doto",
});
