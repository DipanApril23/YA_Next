import { Layout, Hero, CapabilitiesSection, WhyChoose } from "../components";
import Service from "../components/Services/Service";

const HomePage = () => {
  return (
    <Layout>
      <div className="bg-black">
        <Hero />
      </div>
      <div className="bg-white">
        <CapabilitiesSection />
      </div>
      {/* <div className="bg-white">
        <Service />
      </div> */}
      <div className="bg-black">
        <WhyChoose />
      </div>
    </Layout>
  );
};

export default HomePage;
