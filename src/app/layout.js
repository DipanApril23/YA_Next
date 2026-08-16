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
import Script from "next/script";
import "./globals.css";

// ─── Google Tag Manager ───────────────────────────────────────────────
// Container ID. Kept as a single constant because it appears twice — once in
// the loader below and once in the <noscript> fallback — and the two must
// never drift apart. To vary it per environment, swap this for
// `process.env.NEXT_PUBLIC_GTM_ID`; note the value is baked in at build time,
// since this site is exported to static HTML.
const GTM_ID = "GTM-P2BN6H8T";

// Google's snippet verbatim, with only the hard-coded container swapped for
// the constant above.
const GTM_SNIPPET = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

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

        {/* WHY lazyOnload, AND WHY NOT "as high in the <head> as possible".
            Google's instructions are written for plain HTML, where position in
            the document is the only control you have over when a script runs.
            In Next it is `strategy` that decides that, not where the tag sits,
            so the snippet lives here at the foot of <body> and still covers
            every page — this is the root layout.

            The strategy was chosen by measuring, on the exported build served
            gzipped, three mobile runs each:

              no GTM             87
              afterInteractive   75 · 83 · 73   (median 75)
              lazyOnload         82 · 86 · 83   (median 83)

            afterInteractive is Next's usual recommendation for analytics, but
            here it lands gtm.js while the hero is still resolving and costs
            ~8 more points than waiting for idle. lazyOnload holds the
            container until the browser has nothing better to do.

            THE TRADE: tags fire a beat later, so a visitor who leaves within
            the first second or so may go uncounted. For pageviews and
            conversions on a marketing site that is a fair swap; if a tag ever
            has to run before hydration — consent management is the usual
            reason — move it to afterInteractive and accept the cost. */}
        <Script
          id="gtm-loader"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{ __html: GTM_SNIPPET }}
        />
      </body>
    </html>
  );
}
