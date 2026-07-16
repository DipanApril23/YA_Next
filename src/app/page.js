import { Layout } from "@/components/layout";
import { Hero, MainServices, WhyChoose } from "@/components/sections";

export default function Home() {
  return (
    <Layout>
      <div className="bg-black">
        <Hero />
      </div>
      {/* Light-theme section — owns its own background */}
      <MainServices />
      <div className="bg-black">
        <WhyChoose />
      </div>
    </Layout>
  );
}
