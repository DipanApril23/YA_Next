"use client";

// ─── DeferredSection ──────────────────────────────────────────────────
// Mounts a heavy below-the-fold section only when the visitor scrolls
// near it. Until then it renders an empty placeholder holding the
// section's background colour and an approximate height, so the page
// height stays stable and fast scrolling never shows a wrong-colour gap.
// Because each section (and its GSAP / framer-motion code, and the
// GoHighLevel booking iframe) loads on approach, none of that JavaScript
// is downloaded, parsed or executed during the initial page load.
//
// WHY THE MODULE IS LOADED BY HAND, not via next/dynamic:
// the placeholder must keep its reserved height until the chunk has
// actually arrived. Swapping to a `loading: null` boundary the moment the
// observer fires collapses the placeholder to height 0, which pulls every
// section below it up the page and trips their observers too — one
// section entering the viewport then chain-reacts into all of them
// mounting at once. Holding `minHeight` until `Comp` is resolved keeps
// each section independent.
//
// The wrapper permanently carries the section's anchor `id` (plus the
// 96px scroll-margin the sections use to clear the fixed navbar), so
// navbar links like #services always have a target — before, during and
// after the chunk loads.
//
// Chunks are also prefetched on the visitor's first interaction (scroll,
// pointer or touch), so by the time anyone reaches a section its code is
// already in cache and it appears instantly.

import { useEffect, useRef, useState } from "react";

const LOADERS = {
  MainServices: () => import("./sections/MainServices/MainServices"),
  OurProcess: () => import("./sections/OurProcess/OurProcess"),
  ConsultationCTA: () => import("./sections/ConsultationCTA/ConsultationCTA"),
  CaseStudies: () => import("./sections/CaseStudies/CaseStudies"),
  Testimonials: () => import("./sections/Testimonials/Testimonials"),
};

/* Warm every section chunk once, on the first sign of a real visitor.
   Automated passes (Lighthouse, crawlers) never interact, so they never
   pay for this. */
let prefetched = false;
function prefetchAll() {
  if (prefetched) return;
  prefetched = true;
  for (const load of Object.values(LOADERS)) load();
}

export default function DeferredSection({ name, id, minHeight, background }) {
  const ref = useRef(null);
  const [Comp, setComp] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    const load = () => {
      LOADERS[name]().then((mod) => {
        if (!cancelled) setComp(() => mod.default);
      });
    };

    /* Search-engine renderers (Googlebot et al.) don't scroll — they render
       once with the viewport stretched to roughly the full page height. No
       real phone or monitor is anywhere near this tall, so treating it as
       "load everything now" makes the whole page indexable without costing
       a single visitor an extra byte. */
    if (typeof IntersectionObserver === "undefined" || window.innerHeight > 2000) {
      load();
      return () => {
        cancelled = true;
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [name]);

  useEffect(() => {
    const events = ["pointerdown", "touchstart", "wheel", "keydown"];
    const onFirstInput = () => {
      prefetchAll();
      for (const e of events) window.removeEventListener(e, onFirstInput);
    };
    for (const e of events) {
      window.addEventListener(e, onFirstInput, { once: true, passive: true });
    }
    return () => {
      for (const e of events) window.removeEventListener(e, onFirstInput);
    };
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      style={
        Comp
          ? { scrollMarginTop: "96px" }
          : { scrollMarginTop: "96px", minHeight, background }
      }
    >
      {Comp ? <Comp /> : null}
    </div>
  );
}
