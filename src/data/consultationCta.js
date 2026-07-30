// ─── Consultation CTA section — data loader ───────────────────────────
//
// A thin adapter over ./content/consultationCta.json.
//
// The section is the mid-page booking block: a "blueprint" panel on the left
// and an embedded GoHighLevel form on the right. `CONSULTATION_CTA_FORM`
// carries the embed settings (the iframe src is built as
// `${widgetBaseUrl}/${id}`), `CONSULTATION_CTA_CONTENT` carries the copy.
//
// What deliberately does NOT live in the data, because it is presentation
// rather than content: the blueprint SVG illustrations (GrowthSketch and
// BackgroundNetwork) and the decorative class lists — those stay in
// ConsultationCTA.jsx. Per-item brand colours DO stay in the data and are
// forwarded to CSS as the `--dot` custom property.
//
// Consumed by: src/components/sections/ConsultationCTA/ConsultationCTA.jsx.

import consultationCtaContent from "./content/consultationCta.json";

export const CONSULTATION_CTA_FORM = consultationCtaContent.form;
export const CONSULTATION_CTA_CONTENT = consultationCtaContent.content;
