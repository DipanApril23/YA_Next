// ─── Site footer — data loader ────────────────────────────────────────
//
// A thin adapter over ./content/footer.json. The footer renders on EVERY
// route (it is mounted in the app shell, src/components/layout/Layout), so
// two rules matter here:
//
//   1. Every in-page target is written as "/#anchor" — root-relative — never
//      a bare "#anchor". A bare hash resolves against the current route, so it
//      would do nothing for a visitor who is not already on the home page.
//   2. The link columns mirror the navbar silo (./content/nav.json) so the
//      menu and the footer can never drift apart.
//
// `socials[].iconKey` selects an inline brand SVG from SOCIAL_ICONS in
// Footer.jsx (lucide-react no longer ships brand marks), which keeps the data
// free of JSX.
//
// Consumed by: src/components/layout/Footer/Footer.jsx (via the @/data barrel).

import footerContent from "./content/footer.json";

export const FOOTER_CONTENT = footerContent.content;
export const FOOTER_COLUMNS = footerContent.columns;
export const FOOTER_SOCIALS = footerContent.socials;
export const FOOTER_CONTACT = footerContent.contact;
export const FOOTER_LEGAL = footerContent.legal;
