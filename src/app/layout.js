// ─── Root layout ──────────────────────────────────────────────────────
// The shell wrapped around every route: self-hosted Roboto font, <html>/<body>,
// site metadata, image-origin preconnect hints, and the modal portal root.
// No page content lives here — sections are composed in app/page.js.

import { Roboto } from "next/font/google";
import "./globals.css";

// Self-hosted via next/font — no render-blocking external stylesheet request.
// Exposed as --font-roboto and consumed by `body` in globals.css.
const roboto = Roboto({
  variable: "--font-roboto",
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
        className={`${roboto.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <div id="portal-modal-root" />
      </body>
    </html>
  );
}
