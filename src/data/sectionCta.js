// ─── Section CTA pair — data loader ───────────────────────────────────
//
// A thin adapter over ./content/sectionCta.json.
//
// The two buttons that close each content section (Our Process, Case Studies,
// Testimonials and the closing Brand Mark). They are ONE record shared by
// every section rather than a copy per section, so retargeting the booking
// link — swapping Calendly for an on-site form, say — is a one-line edit here
// instead of four edits in four components.
//
// The destinations deliberately differ: `primary` mirrors the Hero's "Book
// Consultation" (the external calendar) and `secondary` mirrors the navbar's
// "Contact Us" (the on-page booking form at #book-consultation), so the pair
// offers two real choices rather than the same one twice.
//
// Consumed by: src/components/ui/SectionCTA/SectionCTA.jsx.

import sectionCtaContent from "./content/sectionCta.json";

export const SECTION_CTA = sectionCtaContent;
