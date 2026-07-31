"use client";

// ─── CustomCursor ─────────────────────────────────────────────────────
// Replaces the native pointer with two layers: a 6px dot pinned exactly
// to the cursor, and a ring that trails it. Both paint in
// `mix-blend-mode: difference`, so they invert whatever is under them and
// stay visible over the near-black Hero, the near-white OurProcess band
// and every image on the page. Layer-by-layer notes live in
// customCursor.css.
//
// MOUNTED ONCE, IN THE APP SHELL. It lives in Layout.jsx alongside
// MotionProvider, so it covers every route. Rendering a second one would
// give you two dots fighting over the same pointer.
//
// ── WHAT THE RING DOES ────────────────────────────────────────────────
//   trail     eases toward the pointer instead of snapping to it
//   stretch   deforms along its direction of travel, proportional to
//             speed, and relaxes back to a circle when it settles
//   magnet    drifts partway toward the centre of a button it is over,
//             so the ring reads as attracted rather than merely nearby
//   stick     morphs into the exact box of an element marked to hold it
//   press     scales down on mousedown, springs back on release
//   label     becomes a solid pill carrying a word
//
// ── USAGE ─────────────────────────────────────────────────────────────
// Nothing to configure. Links, buttons, [role="button"], form controls
// and anything carrying `.cursor-hover` expand the ring automatically.
// Three opt-in attributes go further:
//
//   <button data-cursor="Flip">…</button>      ring becomes a "FLIP" pill
//   <a data-cursor-magnetic>…</a>              ring is pulled to its centre
//   <a data-cursor-stick>Contact Us</a>        ring becomes its outline
//
// `data-cursor` reads as a label, so keep it to one short verb — the pill
// is 76px. `data-cursor-stick` suits a bounded, rounded target (a CTA, a
// card, a nav pill); on a long run of inline text the ring would morph
// into an unhelpfully wide bar. Sticking implies magnetism, and both
// imply hover, so never combine them for the same effect.
//
// ── TOUCH AND ASSISTIVE TECH ──────────────────────────────────────────
// On a coarse pointer the effect returns before attaching anything and
// never adds the `has-custom-cursor` gate, so the whole stylesheet stays
// inert and the native cursor is untouched (both layers default to
// `opacity: 0` for exactly this reason). Both elements are aria-hidden
// and pointer-events:none — decoration only. Reduced motion keeps the
// cursor but removes the trail and the deformation.
//
// ── PERFORMANCE ───────────────────────────────────────────────────────
// Position is driven by refs and requestAnimationFrame, not React state:
// the pointer moving does not re-render this component, or anything
// else. Hover uses one delegated listener on `document` rather than a
// listener per interactive element, and the loop writes exactly two
// style properties per frame. Element boxes are measured on hover and
// re-measured only when a scroll or resize invalidates them — never per
// frame, which would force a layout 60 times a second.

import { useEffect, useRef } from "react";
import "./customCursor.css";

// ── Tunables ──────────────────────────────────────────────────────────
// Every rate below is expressed per 60fps frame and then corrected for
// the real frame time, so a 144Hz display eases at the same speed as a
// 60Hz one rather than 2.4× faster.
const RING_EASE = 0.16; // ring follow. 1 = no trail; lower = longer tail
const MAGNET_PULL = 0.28; // 0 = ignore the target, 1 = sit dead centre
const PRESS_EASE = 0.2; // how fast the mousedown squeeze lands
const PRESS_SCALE = 0.82; // ring size at full press

const STRETCH_EASE = 0.12; // how fast deformation builds and relaxes
const STRETCH_MAX = 0.26; // hard cap, or the ring becomes a needle
const STRETCH_REF = 78; // px/frame of ring speed that reaches the cap
const STRETCH_FLOOR = 0.35; // px/frame below which direction stops updating

// Anything that should expand the ring. Kept as one selector string so
// hover detection is a single `closest()` call per pointer transition,
// no matter how many interactive elements the page holds.
const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, label, .cursor-hover, [data-cursor], [data-cursor-magnetic], [data-cursor-stick]';

// Elements the ring is drawn toward. Deliberately narrower than the list
// above: pulling toward the centre of a long inline text link drags the
// ring away from the words the pointer is actually on.
const MAGNETIC =
  'button, [role="button"], .cursor-hover, [data-cursor], [data-cursor-magnetic], [data-cursor-stick]';

// Elements the ring morphs onto.
const STICKY = "[data-cursor-stick]";

// The subset of INTERACTIVE where a hidden native cursor costs the user
// the caret. Over these the custom cursor fades out and customCursor.css
// hands the I-beam back.
const TEXT_FIELD =
  'textarea, [contenteditable="true"], input:not([type="button"], [type="submit"], [type="reset"], [type="checkbox"], [type="radio"], [type="range"], [type="color"], [type="file"])';

// Frame-rate independent lerp factor: `rate` is the fraction to close in
// one 60fps frame, `frames` is how many of those the real frame lasted.
const damp = (rate, frames) => 1 - Math.pow(1 - rate, frames);

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const labelEl = labelRef.current;
    if (!dot || !ring || !labelEl) return;

    // Coarse pointer (phone, tablet) — there is no cursor to replace.
    // Checked once on mount: a device does not change its primary
    // pointer mid-session, and re-evaluating would mean keeping a
    // media-query listener alive for a case that does not occur.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // ── Loop state ─────────────────────────────────────────────────
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let prevX = ringX;
    let prevY = ringY;

    let stretch = 0; // current deformation, 0 = circle
    let angle = 0; // direction of travel, radians
    let press = 1; // current press scale
    let pressed = false;

    let rafId = 0;
    let lastFrame = 0;
    let hasMoved = false;

    // Reduced motion keeps the cursor but drops the trail and the
    // deformation — the ring sits on the pointer as a plain circle.
    const ease = reduceMotion ? 1 : RING_EASE;

    // ── Hover target ───────────────────────────────────────────────
    // `box` is measured once per hover and refreshed only when scroll
    // or resize invalidates it. Measuring inside the loop would force a
    // synchronous layout every frame.
    let activeEl;
    let magnetEl = null;
    let stickEl = null;
    let labelled = false;
    let box = null;
    let boxStale = false;

    const measure = () => {
      const el = stickEl || magnetEl;
      if (!el) {
        box = null;
        return;
      }
      const r = el.getBoundingClientRect();
      box = { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
      if (stickEl) {
        ring.style.width = `${r.width}px`;
        ring.style.height = `${r.height}px`;
      }
      boxStale = false;
    };

    const releaseStick = () => {
      if (!stickEl) return;
      stickEl = null;
      // Hand width, height and radius back to the stylesheet. Clearing
      // the inline values lets the CSS transition carry the ring back
      // to a circle rather than snapping it.
      ring.style.width = "";
      ring.style.height = "";
      ring.style.borderRadius = "";
      ring.classList.remove("is-stuck");
    };

    // ── State, recomputed per pointer transition ───────────────────
    // Driven from `mouseover` alone rather than a paired enter/leave.
    // `mouseover` fires on every element-to-element transition
    // (including back onto <body>), so one handler covers enter, leave
    // and — the case a paired handler gets wrong — moving straight from
    // a labelled element into an unlabelled one, which has to swap the
    // state rather than stack it.
    const applyState = (node) => {
      const el =
        typeof node?.closest === "function" ? node.closest(INTERACTIVE) : null;
      if (el === activeEl) return; // same target, nothing to recompute
      activeEl = el;

      const text = el ? el.getAttribute("data-cursor") : null;
      const overTextField = el ? el.matches(TEXT_FIELD) : false;
      const isSticky = Boolean(el) && !overTextField && el.matches(STICKY);
      const isHover = Boolean(el) && !overTextField;

      releaseStick();
      magnetEl = isHover && el.matches(MAGNETIC) ? el : null;
      stickEl = isSticky ? el : null;
      labelled = Boolean(text);

      if (isSticky) {
        // Inherit the target's own corner radius so a pill stays a pill
        // and a card stays a card.
        ring.style.borderRadius = window.getComputedStyle(el).borderRadius;
        ring.classList.add("is-stuck");
      }
      measure();

      // A stuck ring is already the size of its target; expanding it as
      // well would overshoot the box it is meant to trace.
      ring.classList.toggle("is-hover", isHover && !isSticky);
      ring.classList.toggle("is-label", labelled);
      ring.classList.toggle("is-hidden", overTextField);

      dot.classList.toggle("is-hover", isHover);
      dot.classList.toggle("is-hidden", overTextField || isSticky);

      // Only ever written, never cleared: the pill fades out over 350ms
      // and emptying it now would blank the word mid-fade.
      if (text) labelEl.textContent = text;
    };

    // ── Listeners ──────────────────────────────────────────────────
    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      if (!hasMoved) {
        hasMoved = true;
        // Snap the ring to the pointer on the first move, otherwise it
        // flies in from the centre of the screen as it fades up.
        ringX = prevX = mouseX;
        ringY = prevY = mouseY;
        dot.classList.add("is-visible");
        ring.classList.add("is-visible");
      }
    };

    const onOver = (e) => applyState(e.target);
    const onDown = () => (pressed = true);
    const onUp = () => (pressed = false);

    // A hovered element's box moves with the page; mark it stale and let
    // the loop re-measure once, rather than measuring per scroll event.
    const onReflow = () => {
      if (magnetEl || stickEl) boxStale = true;
    };

    // Without this the pair freezes at its last position while the
    // pointer is off in the browser chrome or another window.
    const onLeave = () => {
      dot.classList.remove("is-visible");
      ring.classList.remove("is-visible");
    };
    const onEnter = () => {
      if (!hasMoved) return; // nothing positioned yet — let onMove reveal it
      dot.classList.add("is-visible");
      ring.classList.add("is-visible");
    };

    // ── The loop ───────────────────────────────────────────────────
    const render = (now) => {
      rafId = requestAnimationFrame(render);

      // Frame time in 60fps units, clamped so a backgrounded tab
      // returning after seconds does not teleport everything at once.
      const frames = lastFrame ? Math.min((now - lastFrame) / 16.667, 4) : 1;
      lastFrame = now;

      if (boxStale) measure();

      // Target: the pointer, pulled toward the hovered element's centre
      // — all the way for a stuck ring, partway for a magnetic one.
      let targetX = mouseX;
      let targetY = mouseY;
      if (box) {
        const pull = stickEl ? 1 : MAGNET_PULL;
        targetX += (box.cx - mouseX) * pull;
        targetY += (box.cy - mouseY) * pull;
      }

      const follow = damp(ease, frames);
      ringX += (targetX - ringX) * follow;
      ringY += (targetY - ringY) * follow;

      // Deformation is taken from the RING's velocity, not the
      // pointer's: the ring is already smoothed, so the stretch inherits
      // that smoothing instead of jittering with raw mouse samples.
      const dx = ringX - prevX;
      const dy = ringY - prevY;
      prevX = ringX;
      prevY = ringY;

      const speed = Math.sqrt(dx * dx + dy * dy) / frames;
      // Below the floor the direction is noise, so the last good angle
      // is held and the ring relaxes along it instead of spinning.
      if (speed > STRETCH_FLOOR) angle = Math.atan2(dy, dx);

      // A stuck ring is tracing a fixed box and a pill is carrying a
      // word: deforming either one just looks broken.
      const wantStretch =
        reduceMotion || stickEl || labelled
          ? 0
          : Math.min(speed / STRETCH_REF, STRETCH_MAX);

      stretch += (wantStretch - stretch) * damp(STRETCH_EASE, frames);
      press += ((pressed ? PRESS_SCALE : 1) - press) * damp(PRESS_EASE, frames);

      // Scale along the direction of travel and squeeze across it, so
      // the ring conserves its apparent mass. Rotating in and back out
      // around the scale keeps the label upright.
      const sx = (1 + stretch) * press;
      const sy = (1 - stretch) * press;
      ring.style.transform =
        `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) ` +
        `rotate(${angle}rad) scale(${sx}, ${sy}) rotate(${-angle}rad)`;
    };

    const root = document.documentElement;

    // All passive: none of these handlers calls preventDefault, and
    // saying so up front keeps them off the scroll-blocking path.
    const opts = { passive: true };
    document.addEventListener("mousemove", onMove, opts);
    document.addEventListener("mouseover", onOver, opts);
    document.addEventListener("mousedown", onDown, opts);
    document.addEventListener("mouseup", onUp, opts);
    window.addEventListener("scroll", onReflow, opts);
    window.addEventListener("resize", onReflow, opts);
    root.addEventListener("mouseleave", onLeave, opts);
    root.addEventListener("mouseenter", onEnter, opts);

    // The gate every rule in customCursor.css hangs off. Added last, so
    // the native cursor is only hidden once the replacement is live.
    root.classList.add("has-custom-cursor");
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      window.removeEventListener("scroll", onReflow);
      window.removeEventListener("resize", onReflow);
      root.removeEventListener("mouseleave", onLeave);
      root.removeEventListener("mouseenter", onEnter);
      root.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="ya-cursor-dot" aria-hidden="true" />
      {/* One element, deliberately: it carries the blend AND the
          transform. Wrapping it would break `difference`. See the
          header note in customCursor.css. */}
      <div ref={ringRef} className="ya-cursor-ring" aria-hidden="true">
        <span ref={labelRef} className="ya-cursor-label" />
      </div>
    </>
  );
}
