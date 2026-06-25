import { Layout } from "@/components/layout";
import { Hero, CapabilitiesSection, Service, WhyChoose } from "@/components/sections";

export default function Home() {
  return (
    <Layout>
      <div className="bg-black">
        <Hero />
      </div>
      <div className="bg-white">
        <CapabilitiesSection />
      </div>
      <div className="bg-white">
        <Service />
      </div>
      <div className="bg-black">
        <WhyChoose />
      </div>
    </Layout>
  );
}
