// ─── Home page ────────────────────────────────────────────────────────
// Composes the single-page site: mounts each section in order inside <Layout>.
// Sections own their own theme/background; this file only sets the order, the
// surrounding black wrappers, and the seam between each pair.
// See README → "Page composition".
//
// SEAMS — <SectionDivider> marks every section boundary. It is height:0 and
// sits ON the seam rather than between the sections, so it adds no vertical
// space and never moves the edge it marks. It takes no props: each seam has a
// dark section on one side and a light one on the other, so the divider is
// drawn entirely in brand colour and reads against both.
//
// PERFORMANCE — every heavy client section below the Hero mounts through
// <DeferredSection>, which loads its code (and the booking iframe) only when
// the visitor scrolls near it. Each placeholder carries the section's anchor
// id, approximate height and background so nothing visibly changes. The Hero
// (above the fold) and the Footer (server components, near-zero JS) render
// normally.

import { Layout } from "@/components/layout";
import { SectionDivider } from "@/components/ui";
import DeferredSection from "@/components/DeferredSection";
import Hero from "@/components/sections/Hero/Hero";
import ServicesSeo from "@/components/sections/Services/ServicesSeo";
import BrandMark from "@/components/sections/BrandMark/BrandMark";

export default function Home() {
  return (
    <Layout>
      <div className="bg-black">
        <Hero />
      </div>

      <SectionDivider />
      {/* Light-theme "blueprint spine" process section — owns its own background */}
      <DeferredSection
        name="OurProcess"
        id="our-process"
        minHeight="2350px"
        background="linear-gradient(180deg,#f4f7fd 0%,#e9eff8 60%,#f4f7fd 100%)"
      />

      <SectionDivider />
      {/* Dark-theme services section — owns its own gradient background.
          The interactive deck is deferred/client and shows one card at a time,
          so <ServicesSeo> renders the full catalogue as server-side, visually
          hidden, crawlable content + Schema.org data (zero visual change). */}
      <ServicesSeo />
      <DeferredSection
        name="Services"
        id="services"
        minHeight="2100px"
        background="linear-gradient(180deg,#010208 0%,#060612 60%,#010208 100%)"
      />

      <SectionDivider />
      {/* Mid-page CTA — consultation booking form; embeds the partners strip. */}
      <DeferredSection
        name="ConsultationCTA"
        id="book-consultation"
        minHeight="2000px"
        background="#F5F7FE"
      />

      <SectionDivider />
      <DeferredSection
        name="CaseStudies"
        id="case-studies"
        minHeight="2100px"
        background="#060610"
      />

      <SectionDivider />
      {/* Client testimonials — light section; owns its own background. It also
          renders the FAQ accordion (#faq) at its foot, so the reserved height
          covers both before the chunk mounts. */}
      <DeferredSection
        name="Testimonials"
        id="testimonials"
        minHeight="2000px"
        background="#ECECF4"
      />

      <SectionDivider />
      {/* Closing brand statement — giant "Young Architects" wordmark with a
          cursor-spotlight gradient fill. Owns its own dark background. The seam
          above gets the same <SectionDivider> as every other boundary: the FAQ
          ends on pure white and this block opens near-black, and an unmarked
          hard cut there read as a dead slab rather than a deliberate edge. */}
      <BrandMark />
    </Layout>
  );
}
