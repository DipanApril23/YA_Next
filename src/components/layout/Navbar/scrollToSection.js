"use client";

// ─── scrollToSection ──────────────────────────────────────────────────
// One answer to "the visitor clicked a #anchor — put them ON that section",
// for a page whose sections are mounted lazily and therefore change height
// while the scroll is still running.
//
// THREE THINGS A PLAIN #ANCHOR CANNOT DO ON THIS PAGE
//
//   1. CLEAR THE FIXED NAVBAR. A native jump parks the section's top edge
//      underneath the pill. Every jump here is offset by NAV_OFFSET instead —
//      the same 96px the <DeferredSection> wrappers reserve as scroll-margin.
//
//   2. REACH A SECTION THAT IS NOT MOUNTED YET. #faq and #partners live inside
//      chunks <DeferredSection> only loads on approach, so at click time the
//      element does not exist and the browser does nothing at all. LAZY_PARENT
//      names the mounted wrapper to head for first; arriving there trips that
//      section's IntersectionObserver, and the settle loop below re-aims at the
//      real element the moment it appears.
//
//   3. STAY CORRECT WHILE THE PAGE GROWS. Every placeholder passed on the way
//      down swaps its reserved minHeight for the real section, which moves the
//      destination after the scroll was issued — so a single scrollTo lands
//      short. The destination is re-measured on a short settle loop and the
//      scroll re-issued whenever it has drifted.
//
// The loop stops the instant the visitor scrolls themselves: a correction that
// fights the wheel is far worse than landing a little short.
//
// Used by every link in the Navbar (see NavLink there) and, via useHashScroll,
// by any other hash link on the page — a shared /#faq URL opened cold included.

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Clearance for the fixed pill: it is 68px tall (56 scrolled) below a 12px top
   pad, so this leaves a comfortable margin above whatever it lands on. Mirrors
   the scrollMarginTop in DeferredSection.jsx — keep the two in step. */
export const NAV_OFFSET = 96;

/* Anchors that only exist once a deferred chunk has mounted → the mounted
   wrapper to scroll to first, which is what triggers that chunk's load.
   #faq sits at the foot of Testimonials, #partners inside ConsultationCTA. */
const LAZY_PARENT = {
  faq: "testimonials",
  partners: "book-consultation",
};

const GIVE_UP_MS = 5000; // hard stop, even if a chunk never arrives
const STABLE_MS = 400; // destination unchanged this long → we're there
const POLL_MS = 90;
const DRIFT_PX = 6; // smaller than this is not worth re-issuing a scroll

/* Only one settle loop may ever be running: a second click re-aims the page. */
let cancelSettle = null;

/**
 * Split an href into the route it points at and the element it wants on that
 * route: "#faq" → {path: null, id: "faq"}, "/#faq" → {path: "/", id: "faq"},
 * "/about-us#team" → {path: "/about-us", id: "team"}.
 *
 * Every on-page link in the site is authored in the "/#id" form precisely so
 * this can tell "scroll here" apart from "go there, then scroll" — see the
 * note on isSamePageAnchor.
 */
export function parseAnchor(href) {
  if (typeof href !== "string") return { path: null, id: null };
  const hashAt = href.indexOf("#");
  if (hashAt === -1 || hashAt === href.length - 1) {
    return { path: href || null, id: null };
  }
  const raw = href.slice(hashAt + 1);
  let id;
  try {
    id = decodeURIComponent(raw);
  } catch {
    id = raw;
  }
  return { path: href.slice(0, hashAt) || null, id };
}

const normalisePath = (p) => {
  if (!p) return "/";
  return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
};

/**
 * Is this href's anchor on the page currently rendered?
 *
 * THIS IS THE WHOLE FIX FOR CROSS-ROUTE NAV. A bare "#faq" is ambiguous: it
 * means "the faq section of whatever page you are on". Clicked from a
 * Coming Soon route it used to be intercepted, scrolled nowhere (no such
 * element there) and still pushed "#faq" onto that route's URL — so the
 * visitor was stranded on the sub-page with a dangling hash in the address
 * bar. Answering this question first is what decides between scrolling and
 * navigating, and the caller only intercepts the click when the answer is yes.
 */
export const isSamePageAnchor = (href, pathname) => {
  const { path, id } = parseAnchor(href);
  if (!id) return false;
  if (!path) return true; // bare "#id" — by definition this page
  return normalisePath(path) === normalisePath(pathname);
};

const reducedMotion = () =>
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Where the page must sit for `el` to be just below the navbar, clamped to what
   the document can actually scroll to (the last section can be short). */
function destinationOf(el) {
  const wanted = window.scrollY + el.getBoundingClientRect().top - NAV_OFFSET;
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  return Math.max(0, Math.min(Math.round(wanted), max));
}

/* Keep re-aiming at #id until its position holds still, the visitor takes over,
   or we run out of patience. `aimedAt` is where the caller has already sent the
   page — null when that was only a staging post (the element did not exist), so
   the first sighting of the real one always re-aims. While the element is still
   missing nothing counts as settled: that is a chunk mid-flight. */
function settle(id, behavior, aimedAt) {
  cancelSettle?.();

  const startedAt = Date.now();
  let stableSince = Date.now();
  let timer = null;

  const stop = () => {
    clearTimeout(timer);
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchmove", stop);
    if (cancelSettle === stop) cancelSettle = null;
  };

  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchmove", stop, { passive: true });
  cancelSettle = stop;

  const tick = () => {
    const el = document.getElementById(id);

    if (!el) {
      stableSince = Date.now(); // still waiting on the chunk
    } else {
      const top = destinationOf(el);
      if (aimedAt === null || Math.abs(top - aimedAt) > DRIFT_PX) {
        window.scrollTo({ top, behavior });
        aimedAt = top;
        stableSince = Date.now();
      } else if (Date.now() - stableSince > STABLE_MS) {
        return stop();
      }
    }

    if (Date.now() - startedAt > GIVE_UP_MS) return stop();
    timer = setTimeout(tick, POLL_MS);
  };

  timer = setTimeout(tick, POLL_MS);
}

/**
 * Scroll to `href` ("#services"), waiting for the section if it has not mounted.
 * Returns false when the anchor exists nowhere on this page — nav entries for
 * pages that are still to be built simply leave the visitor where they are.
 */
export function scrollToSection(href, { updateHash = true } = {}) {
  if (typeof window === "undefined") return false;

  const { id } = parseAnchor(href);
  if (!id) return false;

  const target = document.getElementById(id);
  // Not mounted yet → head for its wrapper; that is what makes it mount.
  const firstLeg = target || document.getElementById(LAZY_PARENT[id] || "");

  /* Bail BEFORE touching the URL. This used to push the hash first and check
     second, which is how a click on a page without the anchor left the address
     bar reading ".../digital-launch-engine#home" while nothing moved. The URL
     is only allowed to claim a section once we know it is on this page. */
  if (!firstLeg) return false;

  if (updateHash && window.location.hash !== `#${id}`) {
    history.pushState(null, "", `#${id}`);
  }

  const behavior = reducedMotion() ? "auto" : "smooth";
  const top = destinationOf(firstLeg);
  window.scrollTo({ top, behavior });
  settle(id, behavior, target ? top : null);
  return true;
}

/**
 * Makes fragment URLs behave like the links above: a cold load of /#faq, a
 * back/forward step between two anchors, or any plain <a href="#…"> elsewhere
 * on the page all get the navbar offset and the wait-for-the-chunk treatment.
 */
export function useHashScroll() {
  /* KEYED ON THE PATHNAME, NOT MOUNTED ONCE. Arriving at "/#faq" from another
     route is a client-side navigation: the Navbar never unmounts, no
     `hashchange` fires (the hash was already in the URL being navigated to),
     and a `[]` effect has long since run. So the visitor landed on the
     homepage at the top and the section they asked for was ignored. Re-running
     whenever the route changes is what makes a cross-page anchor arrive where
     it said it would. */
  const pathname = usePathname();

  useEffect(() => {
    const run = () => scrollToSection(window.location.hash, { updateHash: false });

    // On a cold load the browser jumps first (:target's scroll-margin keeps
    // that landing sane); we take over once React has painted. The same delay
    // covers a client-side arrival, where the new route paints a frame later.
    const initial = window.location.hash ? setTimeout(run, 60) : null;

    window.addEventListener("hashchange", run);

    return () => {
      if (initial) clearTimeout(initial);
      window.removeEventListener("hashchange", run);
    };
  }, [pathname]);
}
