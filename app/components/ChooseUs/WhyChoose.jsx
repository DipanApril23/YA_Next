import Image from "next/image";
import { Container } from "..";
import about from "../../assets/json/about.json";
import css from "./WhyChoose.module.css";

const WhyChoose = () => {
  const aboutImages = Object.values(about);

  return (
    <Container>
      <article
        id="wcu"
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="600"
        className="flex flex-col justify-between gap-6 py-16 md:flex-row"
      >
        <section className="flex w-full flex-col justify-center gap-y-2 text-white md:w-[30%]">
          <h2 className="font-[Roboto] text-[24px] font-bold leading-8 md:text-[35px] md:leading-10">
            <span className="text-primary-blue">Why choose Us ?</span>
            {"  "}
            <br />
            <span className="text-secondary-dark"> - </span>
            <span className="text-primary">Young Architects</span>
          </h2>
          <h3 className="font-poppins mt-4 text-[16px] opacity-90 md:text-[18px]">
            Choose{" "}
            <span className="text-primary fon">
              {" "}
              <strong>Young Architects</strong>
            </span>{" "}
            for a client-centric approach where your vision is our priority. We
            offer tailored solutions through{" "}
            <span className="text-primary-blue">
              <strong>deep business analysis</strong>
            </span>
            ,{" "}
            <span className="text-primary-blue">
              <strong>collaborative consultancy</strong>
            </span>
            , and a{" "}
            <span className="text-primary-blue">
              <strong>commitment to perfection</strong>
            </span>
            . With us, you&apos;re not just a client —{" "}
            <span className="text-primary">
              <strong>you&apos;re family</strong>
            </span>
            .
          </h3>
        </section>
        <section className="flex w-full flex-wrap items-center justify-center gap-6 md:w-[70%]">
          {aboutImages.map((src, index) => (
            <Image
              key={index}
              className={`w-52 ${index < 3 ? css.pentagonCardCategory2 : css.pentagonCardCategory1}`}
              src={src}
              alt={`about-image-${index + 1}`}
              width={208}
              height={208}
            />
          ))}
        </section>
      </article>
    </Container>
  );
};

export default WhyChoose;
