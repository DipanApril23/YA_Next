import { Layout } from "@/components/layout";
import { Hero, MainServices, OurProcess, WhyChoose } from "@/components/sections";

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
      <div className="bg-black">
        <WhyChoose />
      </div>
    </Layout>
  );
}
