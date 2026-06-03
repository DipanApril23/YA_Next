import { Layout, Hero, CapabilitiesSection, WhyChoose } from "../components";

const HomePage = () => {
  return (
    <Layout>
      <div className="bg-black">
        <Hero />
      </div>
      <div className="bg-white">
        <CapabilitiesSection />
      </div>
      <div className="bg-black">
        <WhyChoose />
      </div>
    </Layout>
  );
};

export default HomePage;
