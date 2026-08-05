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

export const isHashLink = (href) =>
  typeof href === "string" && href.startsWith("#") && href.length > 1;

const idOf = (href) => {
  const raw = href.slice(href.indexOf("#") + 1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
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
  if (typeof window === "undefined" || !isHashLink(href)) return false;

  const id = idOf(href);
  const target = document.getElementById(id);
  // Not mounted yet → head for its wrapper; that is what makes it mount.
  const firstLeg = target || document.getElementById(LAZY_PARENT[id] || "");

  if (updateHash && window.location.hash !== `#${id}`) {
    history.pushState(null, "", `#${id}`);
  }
  if (!firstLeg) return false;

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
  useEffect(() => {
    // On a cold load the browser jumps first (:target's scroll-margin keeps
    // that landing sane); we take over once React has painted.
    const initial = window.location.hash
      ? setTimeout(() => scrollToSection(window.location.hash, { updateHash: false }), 60)
      : null;

    const onHashChange = () => scrollToSection(window.location.hash, { updateHash: false });
    window.addEventListener("hashchange", onHashChange);

    return () => {
      if (initial) clearTimeout(initial);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);
}
