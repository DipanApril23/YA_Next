"use client";

// ─── useLiveInView ────────────────────────────────────────────────────
// Returns [ref, live]. `live` is true while the element is on screen and
// false once it leaves; the stylesheet uses it as the single animation
// switch (`.is-live` → animation-play-state: running).
//
// WHY A PLAY-STATE SWITCH INSTEAD OF MOUNTING/UNMOUNTING THE DIAGRAM
// Flipping animation-play-state never restarts an animation — it only stops
// and resumes the clock. So one boolean buys both behaviours the section
// wants, with no second piece of state:
//   · the one-shot entrance (bars growing, lines drawing) runs the first
//     time the card is seen, and stays finished on every later pass;
//   · the ambient loops (waveform, falling particles, sheen) stop burning
//     frames the moment the card scrolls away.
// Five cards × ~40 animated nodes each is exactly the kind of thing that
// quietly costs a scroll its smoothness if it keeps ticking off screen.
//
// Used by: ./VisualFrame.jsx (every process diagram renders through it).

import { useEffect, useRef, useState } from "react";

export default function useLiveInView({
  /* A third of the diagram visible is enough to start it. */
  threshold = 0.3,
  /* Start slightly before the frame is fully inside the viewport so the
     entrance is already underway when the card settles. */
  rootMargin = "0px 0px -6% 0px",
} = {}) {
  const ref = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* No IntersectionObserver (very old browser, or a test env): show the
       diagram running rather than frozen on its first frame. */
    if (typeof IntersectionObserver === "undefined") {
      setLive(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => setLive(entry.isIntersecting),
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return [ref, live];
}
