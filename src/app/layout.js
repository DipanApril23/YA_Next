import { Roboto, Fraunces, Outfit } from "next/font/google";
import "./globals.css";

// Self-hosted via next/font — no render-blocking external stylesheet request.
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Young-Architects: Aspiring to be the best",
  description: "Official Page of Young Architects",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Warm up the remote-image origin used by the hero card */}
        <link rel="preconnect" href="https://youngarchitects.in" />
        <link rel="dns-prefetch" href="https://youngarchitects.in" />
      </head>
      <body
        className={`${roboto.variable} ${fraunces.variable} ${outfit.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <div id="portal-modal-root" />
      </body>
    </html>
  );
}
