// ─── Site layout ──────────────────────────────────────────────────────
// The app shell — Navbar, the closing BrandMark and the Footer, plus the
// MotionProvider and the SplashCursor overlay — wrapped around every route
// that belongs to the marketing site.
//
// WHY THIS IS A ROUTE GROUP AND NOT THE ROOT LAYOUT. "(site)" is wrapped in
// parentheses, so it groups routes WITHOUT adding a URL segment: the page
// beside this file is still served at "/". The shell used to live in the root
// layout, which meant it wrapped literally every route — including
// not-found. That is exactly what the 404 sheet cannot tolerate: it carries
// its own brand bar and its own footer (the shell would render a second set
// of both) and it hides the system cursor for a crosshair (the shell's
// SplashCursor would keep painting its fluid trail underneath).
//
// So the shell moved down here, and src/app/not-found.jsx — which sits at the
// root, outside this group — renders bare and full-screen as designed.
//
// Anything added to the marketing site belongs in this folder, where it picks
// up the shell for free. Only genuinely chrome-less routes belong beside the
// root layout.

import { Layout } from "@/components/layout";

export default function SiteLayout({ children }) {
  return <Layout>{children}</Layout>;
}
