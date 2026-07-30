// ─── Why Choose Us — data loader ──────────────────────────────────────
//
// A thin adapter over ./content/whyChoose.json.
//
// The copy is stored as an array of tone-tagged SEGMENTS rather than one
// string, so the coloured/bold emphasis inside a sentence stays data-driven
// instead of being hardcoded as JSX. Each segment is
// `{ text, tone?, strong? }` where `tone` is semantic ("blue" | "dark" |
// "primary") and is mapped to a CSS class by TONE_CLASS in WhyChoose.jsx —
// so no styling leaks into the data.
//
// NOTE: this section is not currently mounted on any page (see the README's
// "Component inventory"). Data and component are kept ready to drop back in.
//
// Consumed by: src/components/sections/WhyChoose/WhyChoose.jsx.

import whyChooseContent from "./content/whyChoose.json";

export const WHYCHOOSE_CONTENT = whyChooseContent.content;
