// ─── Navigation silo — data loader ────────────────────────────────────
//
// WHAT THIS FILE IS
// A thin adapter over ./content/nav.json, which holds the site's information
// architecture as a RECURSIVE tree:
//
//   { label, href?, icon?, desc?, comingSoon?, children? }
//
// A node with `children` is a menu; a leaf has an `href`. The Navbar renders
// this to ANY depth — cascading flyouts on desktop, a nested single-open
// accordion on mobile — so adding a deeper sub-level is a data edit, never a
// code change.
//
// THE ONE TRANSFORMATION DONE HERE
// JSON cannot store a React component, so each node's `icon` is a string key
// (a lucide-react component name). `resolveNavIcons` walks the tree once, at
// module load, and swaps every key for the real component from ./navIcons.js.
// The Navbar therefore still receives `item.icon` as a component and needs no
// knowledge of the indirection.
//
// An unknown key resolves to `undefined` rather than throwing: a typo in the
// data (or an icon the CMS has not been taught yet) renders a menu row without
// an icon instead of crashing the whole navigation.
//
// Consumed by: src/components/layout/Navbar/Navbar.jsx (via the @/data barrel).

import navContent from "./content/nav.json";
import { NAV_ICONS } from "./navIcons";

function resolveNavIcons(nodes) {
  return nodes.map((node) => {
    const resolved = { ...node };
    if (node.icon) resolved.icon = NAV_ICONS[node.icon];
    if (node.children) resolved.children = resolveNavIcons(node.children);
    return resolved;
  });
}

/* Chrome around the menu: brand link, CTA and control labels. */
export const NAV_CONTENT = navContent.content;

export const NAV_ITEMS = resolveNavIcons(navContent.items);
