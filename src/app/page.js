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

import { Layout } from "@/components/layout";
import { SectionDivider } from "@/components/ui";
import {
  Hero,
  MainServices,
  OurProcess,
  CaseStudies,
  Testimonials,
  ConsultationCTA,
  WhyChoose,
} from "@/components/sections";

export default function Home() {
  return (
    <Layout>
      <div className="bg-black">
        <Hero />
      </div>

      <SectionDivider />
      {/* Light-theme section — owns its own background */}
      <MainServices />

      <SectionDivider />
      {/* Section owns its own background/theme — wrap in a bg div if it's dark */}
      <OurProcess />

      <SectionDivider />
      {/* Mid-page CTA — consultation booking form; embeds the partners strip. */}
      <ConsultationCTA />

      <SectionDivider />
      <CaseStudies />

      <SectionDivider />
      {/* Client testimonials — light section; owns its own background. */}
      <Testimonials />

      <SectionDivider />
      <div className="bg-black">
        <WhyChoose />
      </div>
    </Layout>
  );
}
