// ─── Root layout ──────────────────────────────────────────────────────
// The document itself, and only that: self-hosted Roboto, <html>/<body>, site
// metadata, image-origin preconnect hints and the modal portal root. No page
// content lives here — sections are composed in app/(site)/page.js.
//
// THE APP SHELL IS NOT HERE ANY MORE. Navbar, BrandMark, Footer and the
// SplashCursor overlay moved into app/(site)/layout.js so they wrap the
// marketing site but NOT src/app/not-found.jsx, which is a full-screen sheet
// with its own brand bar, footer and cursor. See that file for the reasoning.
// The homepage URL is unchanged — "(site)" is a route group, so it adds no
// path segment.

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
