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
import TagManager, { GTM_ID } from "@/components/analytics/TagManager";

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
        {/* Resolve the tag-manager host early. The loader itself is deferred
            (see below), so this only warms DNS — it does not pull the script
            onto the critical path. */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body
        className={`${roboto.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* GTM's <noscript> fallback belongs immediately after <body>, per
            Google's install instructions. It costs nothing for the ~99% of
            visitors who have JavaScript. */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {children}
        <div id="portal-modal-root" />

        {/* WHY THIS IS A COMPONENT AND NOT A <Script strategy="...">.
            None of Next's strategies are late enough. Even `lazyOnload`, which
            this replaced, fires on the load event — and the ~475KB / ~750ms of
            third-party code the container pulls in (GA4, the Meta pixel, Meta's
            CAPI builder) then lands while a throttled phone is still painting
            the hero. That one fan-out was measured to be ~95% of the page's
            Total Blocking Time.

            So the container now waits for a signal that a human is here: first
            interaction, a fallback timer after load, or the page being hidden.
            The reasoning, the measurements and the trade-off are written out in
            full in the component. Position in the document is irrelevant to
            when it runs — it sits here because this is the root layout, so it
            covers every route. */}
        <TagManager id={GTM_ID} />
      </body>
    </html>
  );
}
