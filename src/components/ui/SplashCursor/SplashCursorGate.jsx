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
//   neither          warm the chunk on idle, start the solver on first move
//
// ── TWO SEPARATE MOMENTS, AND WHY ─────────────────────────────────────
// Downloading the module is cheap. Standing up the WebGL context is not: it
// compiles ~15 shader programs and allocates a 1440² dye target, and then
// updateFrame() runs a full Navier-Stokes solve (20 pressure iterations, ~25
// draw calls) every single frame FOREVER — whether or not the pointer has
// ever moved.
//
// On a machine with a real GPU that is invisible. On one without, the solver
// falls back to SwiftShader and runs on the CPU, where it saturates the main
// thread outright: measured on a throttled desktop run, mounting it at load
// produced 147 SECONDS of total blocking time and dragged the performance
// score to 65, while the same page on mobile — where the coarse-pointer check
// above means it is never downloaded — scored 92.
//
// So the split below: `warm` fetches and parses the module when the browser
// next idles, and the component is not MOUNTED (no context, no solver, no
// rAF loop) until the pointer actually moves.
//
// THIS IS NOT A VISUAL TRADE-OFF. The simulation paints nothing on start —
// there is no opening splat, and applyInputs() only injects dye for a pointer
// whose `moved` flag is set. Before the first movement the canvas is a fully
// transparent, empty layer. Arming on that first movement therefore shows the
// visitor the exact same thing, one pointer event later, with the chunk
// already in memory so the trail begins immediately.
//
// The simulation checks the same two media queries itself — it is a public
// component and may be mounted directly on a route. The duplication is the
// point: this file decides what to DOWNLOAD and WHEN TO START, that one
// decides what to RUN.

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/* ssr:false is legal here and not in Layout — this is a client component.
   The chunk is requested on the first render of <SplashCursor>, i.e. only
   once `armed` flips — or earlier, by the idle warm-up below. */
const SplashCursor = dynamic(() => import("./SplashCursor"), { ssr: false });

export default function SplashCursorGate(props) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const matches = (query) => window.matchMedia(query).matches;
    if (matches("(pointer: coarse)")) return;
    if (matches("(prefers-reduced-motion: reduce)")) return;

    /* ── 1. Warm the chunk on idle ──────────────────────────────────
       Fetch and parse the module after everything the page needs to become
       interactive, so the network cost is off the critical path and the
       code is resident before the pointer asks for it. Nothing is executed
       beyond module scope — the WebGL work all lives in an effect that has
       not mounted yet. The 2s timeout is the guarantee: a page that never
       idles still gets it. */
    let idleId = 0;
    let timerId = 0;
    const warm = () => {
      import("./SplashCursor");
    };
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(warm, { timeout: 2000 });
    } else {
      // Safari < 17.4 has no requestIdleCallback; a plain delay past the
      // load burst is close enough for a decoration.
      timerId = window.setTimeout(warm, 1500);
    }

    /* ── 2. Start the solver on the first pointer movement ──────────
       `pointermove` covers mouse, trackpad and pen. `pointerdown` is the
       safety net for the visitor who clicks before moving. Both are passive
       and fire once — after that this file has no further work to do. */
    const arm = () => setArmed(true);
    window.addEventListener("pointermove", arm, { once: true, passive: true });
    window.addEventListener("pointerdown", arm, { once: true, passive: true });

    return () => {
      if (idleId && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timerId) clearTimeout(timerId);
      window.removeEventListener("pointermove", arm);
      window.removeEventListener("pointerdown", arm);
    };
  }, []);

  return armed ? <SplashCursor {...props} /> : null;
}
