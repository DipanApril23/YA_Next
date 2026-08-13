// ─── 404 route ────────────────────────────────────────────────────────
// Rendered by Next.js for unmatched routes and for any notFound() call.
//
// THIS FILE OWNS THE FONTS AND THE METADATA; the view owns the markup. Both
// are Server Components — the whole route ships zero client JavaScript,
// because the warning-sign animation is CSS rather than an animation
// runtime (see @/components/sections/NotFound). Keep it that way: adding
// "use client" anywhere up here would also forfeit the `metadata` export
// below, since a client module cannot declare one.
//
// IT RENDERS OUTSIDE THE APP SHELL. The site's Navbar, BrandMark, Footer and
// SplashCursor are mounted by src/app/(site)/layout.js, not by the root
// layout, so nothing wraps this route. That is deliberate: this page is a
// full-screen drawing sheet with its own brand bar, its own footer and its
// own crosshair cursor, and the shell would duplicate the first two and
// fight the third.
//
// FONTS ARE ROUTE-LOCAL, AND `preload: false` IS WHAT MAKES THAT TRUE.
//
// next/font preloads by default, and this file sits at the app root — so both
// families were being emitted as <link rel="preload"> into EVERY page in the
// tree, homepage included. Measured on the live site that put 52.4KB of font
// the homepage never renders onto its critical path, ahead of the LCP text,
// on every single visit.
//
// With preloading off, the @font-face rules still ship (they are bytes, not
// requests) and the browser fetches the files only when something actually
// asks for those families — which happens on this route and nowhere else.
// The cost lands where it belongs: a 404 pays a few ms, and because both are
// `display: swap` its text paints immediately in the fallback regardless.

import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import NotFound from "@/components/sections/NotFound/NotFound";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

export const metadata = {
  title: "Page Not Found — Young Architects",
  // Unmatched routes already return a real HTTP 404, so this is belt and
  // braces for anything that resolves the page without reading the status.
  robots: { index: false, follow: true },
};

export default function NotFoundPage() {
  return <NotFound fontClassName={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`} />;
}
