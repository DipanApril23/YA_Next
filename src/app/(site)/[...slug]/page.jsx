// ─── Catch-all route for every page the menu points at ────────────────
//
// One file serves all 67 menu destinations. They are placeholders today, so
// giving each its own page.jsx would be 67 near-identical files to delete
// again later; instead the routes are derived from the nav silo itself (see
// src/data/navRoutes.js) and rendered by one <ComingSoon>.
//
// STILL 67 REAL, STATIC PAGES. generateStaticParams enumerates every path at
// build time, so each one is prerendered to HTML with its own <title> and
// description — a crawler sees a normal page, not a client-side redirect.
// Check the build output: they are listed individually as ○ (Static).
//
// IT DOES NOT SWALLOW THE 404. A catch-all matches literally any unmatched
// path, which would ordinarily mean /total-nonsense renders something instead
// of the 404. findNavRoute() is what prevents that: a path that is not in the
// nav silo calls notFound(), which hands over to src/app/not-found.jsx. So the
// animated 404 still answers for genuine typos, and returns a real 404 status.
//
// REPLACING A PLACEHOLDER WITH A REAL PAGE. Add the concrete route — say
// src/app/(site)/about-us/our-team/page.jsx. A specific segment always wins
// over a catch-all in Next's matcher, so the real page takes over with no
// change needed here, and the rest keep working.
//
// The navbar, closing BrandMark and footer come from ../layout.js, so every
// one of these pages carries the full site frame.

import { notFound } from "next/navigation";
import ComingSoon from "@/components/sections/ComingSoon/ComingSoon";
import { NAV_ROUTES, findNavRoute, COMING_SOON_CONTENT } from "@/data";

/* Next passes the matched segments; join them back into the pathname the
   route map is keyed by. */
const pathOf = (slug) => `/${(slug ?? []).join("/")}`;

export function generateStaticParams() {
  return NAV_ROUTES.map((route) => ({
    slug: route.path.split("/").filter(Boolean),
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const route = findNavRoute(pathOf(slug));
  if (!route) return {};

  return {
    title: `${route.label} — ${COMING_SOON_CONTENT.badge} | Young Architects`,
    description: route.desc ?? COMING_SOON_CONTENT.fallbackDesc,
    /* Deliberately not indexed while it is a placeholder: a page that only
       says "coming soon" competing in search for its own keyword is worse
       than no page at all. Links are still followed so crawlers can reach
       the rest of the site. Drop this when the real content lands. */
    robots: { index: false, follow: true },
  };
}

export default async function ComingSoonPage({ params }) {
  const { slug } = await params;
  const route = findNavRoute(pathOf(slug));

  if (!route) notFound();

  return <ComingSoon route={route} />;
}
