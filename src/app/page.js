// ─── Home page ────────────────────────────────────────────────────────
// Composes the single-page site: mounts each section in order inside <Layout>.
// Sections own their own theme/background; this file only sets the order and
// the surrounding black wrappers. See README → "Page composition".

import { Layout } from "@/components/layout";
import {
  Hero,
  MainServices,
  OurProcess,
  ConsultationCTA,
  WhyChoose,
} from "@/components/sections";

export default function Home() {
  return (
    <Layout>
      <div className="bg-black">
        <Hero />
      </div>
      {/* Light-theme section — owns its own background */}
      <MainServices />
      {/* Section owns its own background/theme — wrap in a bg div if it's dark */}
      <OurProcess />
      {/* Mid-page CTA — consultation booking form. Owns its own background. */}
      <ConsultationCTA />
      <div className="bg-black">
        <WhyChoose />
      </div>
    </Layout>
  );
}
