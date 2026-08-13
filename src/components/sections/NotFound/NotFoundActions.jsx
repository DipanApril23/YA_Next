"use client";

// ─── NotFoundActions ──────────────────────────────────────────────────
// The two CTAs at the foot of the 404, rendered with the site's own
// <MagneticButton> so they behave and look exactly like every other primary
// CTA on the site: the button leans toward the pointer on a spring, and
// carries the same layered treatment (ambient glow, gradient wash, shine
// sweep, inner highlight) rather than a lookalike built for this page.
//
// WHY THIS IS A SEPARATE FILE. The rest of the 404 is a Server Component with
// no client JavaScript at all — the warning-sign animation is pure CSS. The
// magnetic effect genuinely needs the client: it reads the pointer position
// against the button's own box every frame and drives two springs with it.
// Isolating it here keeps that cost to these two buttons; the scene, the
// backdrop, the star field and all the copy are still server-rendered and
// ship no JS.
//
// IT BRINGS ITS OWN <LazyMotion>. MagneticButton renders framer-motion's
// lightweight `m.*` elements, which get their features from a provider. On
// the rest of the site that provider is MotionProvider inside the app shell —
// but this route renders OUTSIDE the shell (see src/app/(site)/layout.js), so
// nothing would supply them and every spring would sit inert. `domAnimation`
// is the same feature set the shell uses.

import { LazyMotion, domAnimation } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton/MagneticButton";
import { NOT_FOUND_CONTENT as CONTENT } from "@/data";

export default function NotFoundActions() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="nf-actions">
        {CONTENT.actions.map((action) => (
          <MagneticButton
            key={action.href}
            href={action.href}
            external={action.external}
            variant={action.variant}
            /* The pill shape and metrics the FAQ section's CTA already uses,
               so the 404 matches the site rather than the component's default
               rounded-xl. Everything else — gradients, glow, spring — is the
               component's own. */
            className="rounded-full px-7 py-3 text-sm"
          >
            {action.label}
          </MagneticButton>
        ))}
      </div>
    </LazyMotion>
  );
}
