// ─── Why Choose Us ────────────────────────────────────────────────────
// Dark section, server component. Renders tone-tagged rich copy segments from
// WHYCHOOSE_CONTENT plus the about images. Content → src/data/whyChoose.js
// (+ about.json); scoped styles → WhyChoose.module.css.

import { Fragment } from "react";
import Image from "next/image";
import { Container } from "@/components/ui";
import { about, WHYCHOOSE_CONTENT as CONTENT } from "@/data";
import css from "./WhyChoose.module.css";

/* Maps the semantic `tone` from the data onto a theme colour class. */
const TONE_CLASS = {
  blue: "text-primary-blue",
  dark: "text-secondary-dark",
  primary: "text-primary",
};

/* Renders a list of copy segments, applying tone/strong emphasis. */
const Segments = ({ parts }) =>
  parts.map((part, i) => {
    const content = part.strong ? <strong>{part.text}</strong> : part.text;
    const toneClass = part.tone ? TONE_CLASS[part.tone] : null;

    return toneClass ? (
      <span key={i} className={toneClass}>
        {content}
      </span>
    ) : (
      <Fragment key={i}>{content}</Fragment>
    );
  });

const WhyChoose = () => {
  const aboutImages = Object.values(about);

  return (
    <Container>
      <article
        id="wcu"
        className="cv-section flex flex-col justify-between gap-6 py-16 md:flex-row"
      >
        <section className="flex w-full flex-col justify-center gap-y-2 text-white md:w-[30%]">
          <h2 className="font-[Roboto] text-[24px] font-bold leading-8 md:text-[35px] md:leading-10">
            <Segments parts={CONTENT.headingLine1} />
            <br />
            <Segments parts={CONTENT.headingLine2} />
          </h2>

          <h3 className="mt-4 text-[16px] opacity-90 md:text-[18px]">
            <Segments parts={CONTENT.body} />
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
              sizes="208px"
            />
          ))}
        </section>
      </article>
    </Container>
  );
};

export default WhyChoose;
