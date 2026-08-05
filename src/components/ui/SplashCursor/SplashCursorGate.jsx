"use client";

// ─── SplashCursorGate ─────────────────────────────────────────────────
// What Layout actually mounts. The fluid simulation in ./SplashCursor.jsx is
// ~13KB of shader source and solver that is worth nothing at all to a visitor
// without a mouse — so this decides whether it is downloaded before it is
// downloaded, rather than shipping it to everyone and returning early inside
// it.
//
//   coarse pointer   a fluid trail chasing a finger that is not touching the
//                    screen has nothing to follow
//   reduced motion   the whole point of the effect is motion
//   neither          load it when the browser next goes idle
//
// LOADED ON IDLE, NOT ON FIRST MOVE. Waiting for a mousemove would mean the
// visitor's first gesture — the one that would have drawn the nicest opening
// trail — falls into a chunk that has not arrived yet. requestIdleCallback
// puts the fetch after everything the page needs to become interactive, so it
// costs nothing on the critical path and is still ready before the pointer is.
// The 2s timeout is the guarantee: a page that never idles still gets it.
//
// The simulation checks the same two media queries itself — it is a public
// component and may be mounted directly on a route. The duplication is the
// point: this file decides what to DOWNLOAD, that one decides what to RUN.

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/* ssr:false is legal here and not in Layout — this is a client component.
   The chunk is requested on the first render of <SplashCursor>, i.e. only
   once `armed` flips. */
const SplashCursor = dynamic(() => import("./SplashCursor"), { ssr: false });

export default function SplashCursorGate(props) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const matches = (query) => window.matchMedia(query).matches;
    if (matches("(pointer: coarse)")) return;
    if (matches("(prefers-reduced-motion: reduce)")) return;

    const arm = () => setArmed(true);

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(arm, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    // Safari < 17.4 has no requestIdleCallback; a plain delay past the load
    // burst is close enough for a decoration.
    const timer = setTimeout(arm, 1500);
    return () => clearTimeout(timer);
  }, []);

  return armed ? <SplashCursor {...props} /> : null;
}
