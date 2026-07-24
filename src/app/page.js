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
// (above the fold) and WhyChoose/Footer (server components, near-zero JS)
// render normally.

import { Layout } from "@/components/layout";
import { SectionDivider } from "@/components/ui";
import DeferredSection from "@/components/DeferredSection";
import Hero from "@/components/sections/Hero/Hero";
import WhyChoose from "@/components/sections/WhyChoose/WhyChoose";

export default function Home() {
  return (
    <Layout>
      <div className="bg-black">
        <Hero />
      </div>

      <SectionDivider />
      {/* Light-theme section — owns its own background */}
      <DeferredSection
        name="MainServices"
        id="services"
        minHeight="1900px"
        background="linear-gradient(170deg, #f4f8fd 0%, #eaf1fa 55%, #f2f7fc 100%)"
      />

      <SectionDivider />
      {/* Section owns its own background/theme — wrap in a bg div if it's dark */}
      <DeferredSection
        name="OurProcess"
        id="our-process"
        minHeight="2350px"
        background="#05050c"
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
      {/* Client testimonials — light section; owns its own background. */}
      <DeferredSection
        name="Testimonials"
        id="testimonials"
        minHeight="1200px"
        background="#ECECF4"
      />

      <SectionDivider />
      <div className="bg-black">
        <WhyChoose />
      </div>
    </Layout>
  );
}
