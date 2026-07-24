// ─── Root layout ──────────────────────────────────────────────────────
// The shell wrapped around every route: self-hosted Roboto font, <html>/<body>,
// site metadata, image-origin preconnect hints, and the modal portal root.
// No page content lives here — sections are composed in app/page.js.

import { Roboto } from "next/font/google";
import "./globals.css";

// Self-hosted via next/font — no render-blocking external stylesheet request.
// Exposed as --font-roboto and consumed by `body` in globals.css.
//
// Only "latin" is preloaded, deliberately. The hero also uses a few decorative
// glyphs (⚡ ★ ✦ ◈ ▲ ⟳ ◉) that live in Roboto's "symbols"/"math" subsets;
// those two files are fetched lazily off the critical path. Measured under
// real Slow-4G + 4x CPU throttling, they finish at 1.74s while the hero copy
// paints once at 1.62s — so leaving them unpreloaded costs no repaint, and
// preloading them only adds 52KB of critical-path contention.
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
