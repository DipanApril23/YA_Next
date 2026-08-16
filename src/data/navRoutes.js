// ─── Nav routes — every page the menu points at ───────────────────────
//
// Flattens the nav silo in ./content/nav.json into a flat list of real
// routes, each with the breadcrumb trail that leads to it. This is what
// src/app/(site)/[...slug]/page.jsx renders Coming Soon pages from, and what
// it uses to decide that an unknown URL is a genuine 404 instead.
//
// DERIVED FROM THE TREE, NOT MAINTAINED BESIDE IT. Add a menu item with an
// href and its page exists; remove it and the URL starts 404ing. There is no
// second list to keep in step, which is the only way 67 routes stay correct.
//
// ── WHAT COUNTS AS A ROUTE ────────────────────────────────────────────
//   leaves        a node with an href starting "/" — the clickable rows
//   group nodes   a node with children but no href of its own (the flyout
//                 headers, e.g. "Digital Marketing for Law Firms"). The menu
//                 never links to these, but a visitor who truncates a URL
//                 back to one should land on something rather than a 404, so
//                 they get a page too.
//
// A group's own path is the segment prefix its children already agree on —
// taken from the children rather than re-derived from the label, so the paths
// here can never drift from the hrefs the Navbar actually renders.
//
// ON-PAGE ANCHORS ARE NOT ROUTES. The Home menu's "#services", "#faq" and the
// rest address sections of the homepage; they are skipped here and keep being
// handled by scrollToSection in the Navbar.
//
// Consumed by: src/app/(site)/[...slug]/page.jsx (via the @/data barrel).

import navContent from "./content/nav.json";
import footerContent from "./content/footer.json";

/* A page, not a place on a page. The "#" test is load-bearing: the Home menu's
   entries are authored as "/#services", "/#faq" and so on — root-relative so
   they work from any route (see Navbar/scrollToSection.js). Those start with
   "/" too, so a bare startsWith("/") counted all nine of them as routes and
   generated a Coming Soon page for each, which Next then emitted at the
   percent-encoded paths /%23services, /%23faq … Anything carrying a fragment
   addresses a section of a page that already exists. */
const isRouteHref = (href) =>
  typeof href === "string" && href.startsWith("/") && !href.includes("#");

/* The path a group node sits at: the segments every descendant shares. With
   more than one child that is exactly the group's own path. A lone child
   would agree all the way down to its own leaf, so that case backs off one
   segment. */
function sharedPrefix(paths) {
  if (!paths.length) return null;
  const parts = paths.map((p) => p.split("/").filter(Boolean));

  let i = 0;
  while (parts.every((p) => p[i] !== undefined && p[i] === parts[0][i])) i++;
  if (parts.length === 1) i = Math.max(0, parts[0].length - 1);

  return i > 0 ? `/${parts[0].slice(0, i).join("/")}` : null;
}

const routes = [];

/* Guard against a footer row duplicating a path the menu already produced. */
const byPathHas = (list, path) => list.some((r) => r.path === path);

/* Returns every route path inside this subtree, so the caller can work out
   its own path from its children. */
function walk(node, trail) {
  const childPaths = [];
  const selfTrailEntry = { label: node.label };

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      childPaths.push(...walk(child, [...trail, selfTrailEntry]));
    }
  }

  const path = isRouteHref(node.href) ? node.href : sharedPrefix(childPaths);
  if (!path) return childPaths;

  selfTrailEntry.path = path;

  routes.push({
    path,
    label: node.label,
    /* The description the menu row already carries, reused as the page's
       standfirst so a Coming Soon page still says what it will be about. */
    desc: node.desc ?? null,
    /* The lucide icon KEY (not the component — this module stays free of
       React, like the rest of the nav data layer). ComingSoon resolves it
       through NAV_ICONS, the same registry the menu uses. */
    icon: node.icon ?? null,
    isGroup: Array.isArray(node.children) && node.children.length > 0,
    trail: trail.filter((t) => t.label),
  });

  return childPaths.length ? childPaths : [path];
}

for (const top of navContent.items) {
  // The Home menu is on-page anchors, not pages.
  if (typeof top.href === "string" && top.href.startsWith("#") && !top.children?.some((c) => isRouteHref(c.href))) {
    continue;
  }
  walk(top, []);
}

/* ── Pages the footer links to but the menu does not ──────────────────
   The legal trio (/disclaimer, /terms-and-conditions, /privacy-policy) is
   reachable only from the footer, so walking the nav tree never produces it
   and every one of those links used to 404.

   They are read from the SAME array the footer renders, so a link and its page
   can never disagree: add a row to `legal` in content/footer.json and the page
   exists. Each row carries an `icon` (a NAV_ICONS key) and a `desc`, which are
   what the Coming Soon medallion and standfirst use. */
for (const item of footerContent.legal ?? []) {
  if (!isRouteHref(item.href) || byPathHas(routes, item.href)) continue;
  routes.push({
    path: item.href,
    label: item.label,
    desc: item.desc ?? null,
    icon: item.icon ?? null,
    isGroup: false,
    trail: [],
  });
}

export const NAV_ROUTES = routes;

const byPath = new Map(routes.map((r) => [r.path, r]));

/** Look up one route by its pathname ("/industry/.../seo"). */
export const findNavRoute = (path) => byPath.get(path) ?? null;
