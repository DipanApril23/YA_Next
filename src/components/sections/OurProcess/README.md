# Our Process — "The Blueprint Spine"

A dark-theme, scroll-driven timeline. A "blueprint spine" draws itself down the
centre of the section as you scroll (left rail on mobile); each step is a glass
card with a rotating border-beam, a ghost numeral, a phase annotation, and a
spine node that lights up with the step's colour as the spine passes it.

## File map

| File | Owns |
| ---- | ---- |
| [`OurProcess.jsx`](./OurProcess.jsx) | Structure, GSAP scroll animation, Framer Motion variants, and the `PROCESS_ICONS` lookup. |
| [`ourProcess.css`](./ourProcess.css) | **Every** style rule (all `op-` prefixed). |
| [`../../../data/ourProcess.js`](../../../data/ourProcess.js) | All content: header copy, the five steps, and the backdrop particles. |

Nothing is inline. The component ships **no** utility classes and **no** inline
styles beyond the handful of CSS custom properties it uses to hand *data* to the
stylesheet (see below).

## The data layer

Everything the section says or lists comes from
[`src/data/ourProcess.js`](../../../data/ourProcess.js):

- **`OURPROCESS_CONTENT`** — the badge, the two-part heading (`headingLead` +
  the gradient-highlighted `headingHighlight`), and the sub-heading.
- **`OURPROCESS_STEPS`** — one object per step. Edit copy, reorder, add or
  remove steps here; the numeral, the node, the ghost annotation, the ticks and
  the `x / 05` counter all follow the array automatically.
- **`OURPROCESS_PARTICLES`** — fixed, deterministic positions for the drifting
  backdrop dots (fixed so server and client render identically — no hydration
  mismatch).

All three are re-exported from the central barrel
[`src/data/index.js`](../../../data/index.js), so the component imports them from
`@/data`.

### Per-step colour is data, not style

Each step carries an `accent` and a `glow`. The component forwards them onto the
`<li>` as custom properties:

```jsx
<li className="op-step" style={{ "--accent": step.accent, "--glow": step.glow }}>
```

From there the CSS cascades that single colour to the node, its active glow, the
ghost annotation line, the card icon, the tag pill, the border-beam and the
measurement ticks — using `var(--accent)` / `var(--glow)` and `color-mix()` for
the translucent tints. **To recolour a step, change one line in the data file.**

### Icons

`icon` is a plain string key (e.g. `"consult"`). The component resolves it to an
SVG through the `PROCESS_ICONS` map in
[`OurProcess.jsx`](./OurProcess.jsx) — the same pattern MainServices uses for
`SERVICE_ICONS`. To add an icon: add an entry to `PROCESS_ICONS`, then reference
its key from the step in the data file.

## Styling notes (`ourProcess.css`)

- Class prefix: `op-`. Breakpoints follow the project theme in
  [`globals.css`](../../../app/globals.css): **sm 576px · md 768px · lg 992px**.
- The spine fill is centred on desktop with `margin-left` (not `transform`) so
  GSAP is free to animate its `scaleY` without a transform collision.
- The border-beam is a masked `conic-gradient` on `.op-card::after`, driven by
  the registered `@property --op-angle`; browsers without `@property` fall back
  to the static `.op-card-edge`.
- All ambient animation is disabled under `prefers-reduced-motion` (both here
  and globally in `globals.css`); the GSAP effect also short-circuits to a
  finished state when the user prefers reduced motion.

## Where it's used

Rendered by [`src/app/page.js`](../../../app/page.js) via the sections barrel
[`../index.js`](../index.js). The section owns its own dark background, so it is
**not** wrapped in a `bg-black` div on the page.
