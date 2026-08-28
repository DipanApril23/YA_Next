# Our Process — "The Blueprint Spine"

A dark-theme, scroll-driven timeline. A "blueprint spine" draws itself down the
centre of the section as you scroll (left rail on mobile); each step is a glass
card with a rotating border-beam, a ghost numeral, a phase annotation, and a
spine node that lights up with the step's colour as the spine passes it.

Inside every card sits an **animated diagram of that phase** — a live call, a
blueprint drafting itself, a funnel with traffic falling through it, a chart
where the winner is scaled and the waste is cut, a pipeline closing out. They
are the reason the section reads as something happening rather than five
paragraphs of copy. See [Phase diagrams](#phase-diagrams) below.

## File map

| File | Owns |
| ---- | ---- |
| [`OurProcess.jsx`](./OurProcess.jsx) | Structure, GSAP scroll animation, Framer Motion variants, and the `PROCESS_ICONS` lookup. |
| [`ourProcess.css`](./ourProcess.css) | **Every** style rule for the section itself (all `op-` prefixed), including the `.op-card-visual` slot the diagram drops into. |
| [`visuals/`](./visuals) | The five phase diagrams — see [below](#phase-diagrams). Self-contained: its own components, its own stylesheet (`opv-` prefixed), its own in-view hook. |
| [`../../../data/content/ourProcess.json`](../../../data/content/ourProcess.json) | **Editable copy** — header text and the five steps. Safe to hand to a CMS. |
| [`../../../data/config/ourProcessParticles.json`](../../../data/config/ourProcessParticles.json) | Developer config — the backdrop particle positions. Not CMS content. |
| [`../../../data/ourProcess.js`](../../../data/ourProcess.js) | Thin loader that re-exports the two JSON files under the names the component imports. |

Nothing is inline. The component ships **no** utility classes and **no** inline
styles beyond the handful of CSS custom properties it uses to hand *data* to the
stylesheet (see below).

## The data layer

Everything the section says or lists comes from JSON, surfaced by the thin loader
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

## Phase diagrams

Each step renders one animated diagram, resolved from `step.visual.kind` exactly
the way `step.icon` is resolved — the key lives in the content JSON, the lookup
lives in [`visuals/index.js`](./visuals/index.js). A missing or unknown `kind`
renders nothing, so a CMS typo degrades to the card's copy instead of breaking
the page.

| `kind` | Draws | The line it illustrates |
| ------ | ----- | ----------------------- |
| `consult` | Connected caller, live voice waveform, notes landing one by one | "understand your business goals in depth" |
| `plan` | A spec sheet drafting itself: spine, modules, dimension rules, revision stamp | "built around your goals, market, and budget" |
| `funnel` | The funnel outline draws, stages light up, traffic falls and converges on the spout | "a fail-proof marketing funnel … deployed" |
| `scale` | Columns grow, a trend draws across them, one is scaled and lit, one is pulled back and greyed | "winners get budget, waste gets cut" |
| `close` | Three leads advance along their tracks; a ring closes and the check drops in | "every lead captured, followed up, and accounted for" |

**Nothing in a diagram is a claim.** Every number in them is geometry generated
in the component (column heights, funnel taper, pipeline progress); the content
JSON carries only labels. There is deliberately no "+182% ROAS" anywhere — a
decorative figure a visitor could read as a result is a liability, not a flourish.

### How the animation is wired

Two conventions carry the whole folder, and both are documented at the top of
[`processVisuals.css`](./visuals/processVisuals.css):

1. **A selector's plain declarations are the *finished* state**, and keyframes
   run *from* the un-built state with `animation-fill-mode: backwards`. So the
   un-built state shows before the animation starts, the element returns to its
   own CSS after, and `prefers-reduced-motion` can simply drop the animations —
   every diagram is then already drawn complete.
2. **One switch.** `.opv` pauses every animation inside it and `.is-live` runs
   them, set by [`useLiveInView`](./visuals/useLiveInView.js) while the frame is
   on screen. Pausing never restarts an animation, so the same boolean gives
   both behaviours: entrances play once on the first pass, and the ambient loops
   (waveform, falling traffic, sheen) stop costing frames the moment the card
   scrolls away — which is what keeps five panels of animated nodes off the
   scroll's critical path.

Where an element has both an entrance and a loop on the same property, the loop
carries a delay past the entrance and no fill-mode so it stays inert until then;
where that is not enough they are merged into a single keyframe track (see
`.opv-column.is-cut`). All geometry reaches the sheet as custom properties, and
any value computed during render uses integer or plain arithmetic only —
`Math.sin` and friends are allowed to differ in their last bits between engines,
which is a hydration mismatch waiting to happen.

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
