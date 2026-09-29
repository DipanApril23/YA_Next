"use client";

// ─── TagManager ───────────────────────────────────────────────────────
// Loads the Google Tag Manager container, and everything it fans out to
// (GA4's gtag.js, the Meta pixel, Meta's CAPI param builder), on the first
// sign of a real visitor rather than on a timer tied to page load.
//
// ── WHY THIS EXISTS ──────────────────────────────────────────────────
// The container is small; what it PULLS IN is not. Measured on the exported
// build under Lighthouse's mobile profile (Moto G Power, Slow 4G, 4x CPU):
//
//   gtm.js                    124KB   134ms scripting
//   gtag/js (GA4)             170KB   227ms scripting
//   fbevents.js (Meta pixel)  109KB   202ms scripting
//   signals/config (Meta)     141KB   181ms scripting
//   capiParamBuilder          ~55KB
//   ─────────────────────────────────────────────────────
//   ~475KB and ~750ms of main thread, none of it ours.
//
// That is essentially the whole of the page's Total Blocking Time. Blocking
// those four origins and changing nothing else took the mobile run from
// TBT 670ms / score 82 to TBT 40ms / score 89. The tags are not slow because
// they are badly installed — they are slow because they are what they are.
//
// `strategy="lazyOnload"` (what this replaced) waits for the browser's load
// event, which on a throttled phone still lands inside the window Lighthouse
// measures, and — more to the point — inside the window a real visitor is
// still trying to read the hero. So the container went from "as early as
// possible" to "as late as it can be without losing the visit".
//
// ── WHEN IT ACTUALLY FIRES ───────────────────────────────────────────
// Whichever of these comes first:
//
//   1. First interaction   pointer, touch, wheel, scroll, key or mouse move.
//                          A human produces one of these within a second or
//                          so of the page settling; this is the normal path.
//   2. IDLE_FALLBACK_MS    after the load event, for the visitor who lands
//                          and genuinely reads without touching anything.
//   3. Page being hidden   tab switch, back button, app switch. This is the
//                          bounce path: it fires the container while the
//                          document is still alive so the pageview is sent
//                          rather than lost.
//
// ── THE TRADE, STATED PLAINLY ────────────────────────────────────────
// A visitor who opens the page and closes it again without moving, scrolling
// or backgrounding it inside IDLE_FALLBACK_MS is not counted. That is a very
// small slice of real traffic, and it is the slice that never saw the page
// either. What IS lost is precision on "time on page" for the first moments
// of a visit, because the container starts its clock late.
//
// IF A TAG MUST RUN BEFORE INTERACTION — a consent-management platform is the
// usual reason, since it has to gate the others — it cannot live behind this.
// Move that one tag to a `<Script strategy="afterInteractive">` of its own and
// leave the rest here; do not switch this whole file back.

import { useEffect } from "react";

// Container ID. Single constant because it appears here and in the <noscript>
// fallback in the root layout, and the two must never drift apart.
export const GTM_ID = "GTM-P2BN6H8T";

// How long after the load event to give up waiting for an interaction. Long
// enough to sit outside the burst of work that decides the page's Core Web
// Vitals, short enough that a genuinely idle reader is still recorded.
const IDLE_FALLBACK_MS = 6000;

// Google's snippet verbatim, with the hard-coded container swapped for the
// constant above.
function injectGtm(id) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtm.js?id=" + id;
  document.head.appendChild(s);
}

export default function TagManager({ id = GTM_ID }) {
  useEffect(() => {
    // Hot reload in dev, or a second mount, must not push a second container.
    if (window.__gtmLoaded) return;

    const EVENTS = [
      "pointerdown",
      "touchstart",
      "wheel",
      "scroll",
      "keydown",
      "mousemove",
    ];

    let timer = 0;

    const cleanup = () => {
      for (const e of EVENTS) window.removeEventListener(e, start);
      document.removeEventListener("visibilitychange", onHide);
      if (timer) clearTimeout(timer);
      timer = 0;
    };

    function start() {
      if (window.__gtmLoaded) return;
      window.__gtmLoaded = true;
      cleanup();
      injectGtm(id);
    }

    function onHide() {
      // Only the leaving direction matters — a tab becoming visible again is
      // not a signal that the visitor is about to disappear.
      if (document.visibilityState === "hidden") start();
    }

    for (const e of EVENTS) {
      window.addEventListener(e, start, { once: true, passive: true });
    }
    document.addEventListener("visibilitychange", onHide);

    // The fallback clock starts at the load event, not at mount: on a slow
    // connection mount can happen while the page is still fetching, and the
    // point is to stay clear of that window entirely.
    const arm = () => {
      timer = window.setTimeout(start, IDLE_FALLBACK_MS);
    };
    if (document.readyState === "complete") {
      arm();
    } else {
      window.addEventListener("load", arm, { once: true });
    }

    return cleanup;
  }, [id]);

  return null;
}
