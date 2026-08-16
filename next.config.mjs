/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Static export, for Hostinger shared hosting ──────────────────────
  // Premium Web Hosting runs Apache/LiteSpeed with PHP — there is no Node
  // process to serve a Next build — so the site is pre-rendered to plain HTML
  // and uploaded to public_html. `next build` now writes `out/`; that folder's
  // CONTENTS are what goes on the server.
  //
  // Every route here is already static (the homepage, the 404 and all 67 menu
  // pages come from generateStaticParams), so nothing is lost by exporting.
  // Read the two notes below before changing hosts back.
  output: "export",

  // Apache resolves a directory to its index.html, so this emits
  // `out/our-services/seo/index.html` and the URL /our-services/seo works with
  // no rewrite rules. Without it Next writes `our-services/seo.html`, which a
  // default Apache config will NOT serve at the extensionless URL.
  trailingSlash: true,

  experimental: {
    // OFF, and it was measured both ways before deciding.
    //
    // Inlining the route's CSS was a clear win when this site was ONE page on
    // a Node host: it removed five render-blocking stylesheet requests worth
    // ~250ms from the homepage's first paint.
    //
    // It stopped being a win at 68 static pages. The stylesheet is ~126KB, and
    // inlining copies it into every page AND into every page's RSC payload —
    // which took the export from 24MB to 66MB, made `industry/` alone 38MB,
    // and was what made the Hostinger File Manager give up part-way through
    // extracting the archive. It also means the CSS can never be cached
    // between pages: every navigation re-downloads it.
    //
    // Measured on the exported build, served gzipped:
    //   inlined     desktop 99 · mobile 88 · 66MB
    //   external    desktop 98 · mobile 87 · 24MB
    // One point, inside run-to-run noise, for two-thirds of the payload.
    //
    // Turn it back on if this ever returns to a single-page deployment.
    inlineCss: false,
  },

  images: {
    // REQUIRED BY output: "export". Next's image optimizer is a server route
    // (/_next/image); a static host has no such route, so images have to be
    // emitted as-is. Everything below this line is consequently inert on
    // Hostinger and only takes effect if the site moves back to a Node host
    // (Vercel) — kept, not deleted, so that move is a one-line change.
    //
    // WHAT THIS COSTS: no AVIF/WebP re-encoding and no per-breakpoint resizing,
    // so a phone downloads the same file a desktop does. The source art is
    // already .webp, so the loss is the resizing rather than the format.
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "youngarchitects.in",
      },
    ],

    // Serve AVIF first (smaller), fall back to WebP. Visually identical.
    formats: ["image/avif", "image/webp"],

    qualities: [75, 100],

    // Cache optimized images for 31 days. The remote origin sends short
    // cache lifetimes, which Lighthouse flags ("efficient cache lifetimes");
    // this floor overrides that for the /_next/image responses.
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
