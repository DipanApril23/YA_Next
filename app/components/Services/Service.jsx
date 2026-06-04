"use client";
import Image from "next/image";
import ServiceCards from "./ServiceCards";
import { Container } from "..";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "10+", label: "Projects Delivered", icon: "🚀" },
  { value: "30+", label: "Happy Clients", icon: "🤝" },
  { value: "4.1★", label: "Client Rating", icon: "⭐" },
];

const floatingBadges = [
  {
    text: "AI-Powered",
    icon: "🤖",
    position: "top-4 -right-6",
    delay: 0,
    borderColor: "border-pink-500/40",
    bg: "from-pink-900/60 to-black/80",
  },
  {
    text: "Custom Solutions",
    icon: "⚡",
    position: "-bottom-4 -left-6",
    delay: 0.5,
    borderColor: "border-blue-500/40",
    bg: "from-blue-900/60 to-black/80",
  },
];

const Service = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-80px" });

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#04040f]"
      ref={sectionRef}
    >
      {/* ── Ambient background glows ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 left-1/3 h-[500px] w-[500px] rounded-full bg-blue-700/20 blur-[130px]"
          animate={isInView ? { scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] } : {}}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-pink-600/20 blur-[130px]"
          animate={isInView ? { scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] } : {}}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />

        {/* Top separator line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      </div>

      <Container>
        <article className="relative flex flex-col gap-20 py-28">

          {/* ── Section Badge + Heading ── */}
          <div className="flex flex-col items-center gap-4 text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false }}
              className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-pink-400"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-pulse" />
              What We Offer
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: false }}
              className="text-5xl font-black text-white md:text-6xl"
            >
              Our{" "}
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-pink-500 bg-clip-text text-transparent">
                Services
              </span>
            </motion.h2>

            {/* Decorative line under heading */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: false }}
              className="h-px w-40 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
            />
          </div>

          {/* ── Intro Split Layout ── */}
          <section className="flex flex-col-reverse items-center justify-between gap-14 md:flex-row">

            {/* Left — Copy + Stats + CTA */}
            <motion.div
              className="flex w-full flex-col gap-8 md:w-[55%]"
              initial={{ opacity: 0, x: -48 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: false }}
            >
              <div className="flex flex-col gap-4">
                <h3 className="text-3xl font-extrabold leading-tight tracking-tight md:text-[2.25rem]">
                  <span className="text-blue-400">Create a new way to enhance your </span>
                  <span className="bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent">
                    business needs and grow consistently
                  </span>
                </h3>
                <p className="max-w-lg text-base leading-relaxed text-slate-400">
                  Stay organised and improve. Streamline custom development,
                  marketing, design and other business operations of your
                  enterprise. Let us help enhance the bottom line of your
                  business with our custom-made solutions.
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 * i + 0.3 }}
                    viewport={{ once: false }}
                    whileHover={{ y: -4, scale: 1.03 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm transition-colors duration-300 hover:border-blue-500/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="text-xl">{stat.icon}</div>
                    <div className="mt-1 bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-2xl font-black text-transparent">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-[0.65rem] font-semibold uppercase tracking-widest text-slate-500">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA button */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: false }}
              >
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-pink-500 px-8 py-3.5 font-bold text-white shadow-[0_0_30px_rgba(99,102,241,0.35)] transition-shadow duration-300 hover:shadow-[0_0_50px_rgba(168,85,247,0.5)]"
                >
                  <span className="relative z-10">Explore All Services</span>
                  <motion.span
                    className="relative z-10 inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                  {/* Shimmer sweep */}
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right — Image with glow + floating badges */}
            <motion.div
              className="relative flex w-full justify-center md:w-[45%]"
              initial={{ opacity: 0, x: 48, scale: 0.92 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: false }}
            >
              <div className="relative w-full max-w-[420px]">
                {/* Multi-layer glow halo */}
                <div className="absolute inset-0 scale-90 rounded-full bg-blue-600/25 blur-[60px]" />
                <div className="absolute inset-0 scale-75 rounded-full bg-pink-600/20 blur-[40px]" />

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    className="relative z-10 w-full object-contain drop-shadow-[0_0_40px_rgba(99,102,241,0.3)]"
                    src="https://youngarchitects.in/assets/image/service-wire.webp"
                    alt="service-image"
                    width={500}
                    height={500}
                  />
                </motion.div>

                {/* Floating badges */}
                {floatingBadges.map((badge, i) => (
                  <motion.div
                    key={i}
                    className={`absolute ${badge.position} z-20`}
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: badge.delay + 0.6 }}
                    viewport={{ once: false }}
                    animate={{ y: [0, i % 2 === 0 ? -7 : 7, 0] }}
                    // Override animate after initial for floating
                    style={{ animationDelay: `${badge.delay}s` }}
                  >
                    <motion.div
                      animate={{ y: [0, i % 2 === 0 ? -7 : 7, 0] }}
                      transition={{ duration: 3.5 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: badge.delay }}
                      className={`flex items-center gap-2 rounded-xl border ${badge.borderColor} bg-gradient-to-br ${badge.bg} px-3 py-2 text-xs font-bold text-white backdrop-blur-md shadow-lg`}
                    >
                      <span>{badge.icon}</span>
                      <span>{badge.text}</span>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* ── Service Cards ── */}
          <ServiceCards />

        </article>
      </Container>
    </section>
  );
};

export default Service;