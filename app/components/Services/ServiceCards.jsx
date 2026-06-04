"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { services } from "../../assets";
import { Modal } from "..";
import { motion, AnimatePresence } from "framer-motion";

const MARKETING_TAB = "marketing";
const DESIGNING_TAB = "designing";
const DEVELOPMENT_TAB = "development";
const tabs = [MARKETING_TAB, DEVELOPMENT_TAB, DESIGNING_TAB];

const TAB_META = {
  marketing: { icon: "📊", label: "Marketing" },
  development: { icon: "⚙️", label: "Development" },
  designing: { icon: "🎨", label: "Designing" },
};

/* ── Card entrance animation variants ── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.93 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -24,
    scale: 0.95,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

/* Tab accent colours per category */
const TAB_ACCENTS = {
  marketing: { from: "from-amber-500", to: "to-orange-500", glow: "rgba(245,158,11,0.4)" },
  development: { from: "from-blue-500", to: "to-violet-500", glow: "rgba(99,102,241,0.45)" },
  designing: { from: "from-pink-500", to: "to-fuchsia-500", glow: "rgba(236,72,153,0.4)" },
};

const ServiceCards = () => {
  const modalRootRef = useRef(null);
  const [activeTab, setActiveTab] = useState(DEVELOPMENT_TAB);
  const [activeServiceList, setActiveServiceList] = useState(services[DEVELOPMENT_TAB]);
  const [selectedService, setSelectedService] = useState(null);
  const [direction, setDirection] = useState(1);

  const toggleModalRoot = (service) => {
    setSelectedService(service);
    modalRootRef.current.toggle();
  };

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    const oldIdx = tabs.indexOf(activeTab);
    const newIdx = tabs.indexOf(tab);
    setDirection(newIdx > oldIdx ? 1 : -1);
    setActiveTab(tab);
    setActiveServiceList(services[tab]);
  };

  const accent = TAB_ACCENTS[activeTab];

  return (
    <article>
      {/* ── Tab Bar ── */}
      <motion.section
        className="mb-14 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
      >
        <div className="relative flex rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-md gap-1">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            const meta = TAB_META[tab];
            const a = TAB_ACCENTS[tab];
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className="relative flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold capitalize transition-colors duration-300"
                style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.45)" }}
              >
                {/* Animated pill background */}
                {isActive && (
                  <motion.span
                    layoutId="activeTabPill"
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${a.from} ${a.to}`}
                    style={{ boxShadow: `0 4px 20px ${a.glow}` }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 text-base leading-none">{meta.icon}</span>
                <span className="relative z-10">{meta.label}</span>
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* ── Accent divider line that changes colour per tab ── */}
      <motion.div
        className={`mx-auto mb-10 h-px w-48 bg-gradient-to-r ${accent.from} ${accent.to}`}
        key={activeTab + "-line"}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* ── Cards Grid with AnimatePresence ── */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.section
          key={activeTab}
          custom={direction}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid grid-cols-1 place-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3 [&>*:last-child:nth-child(3n-2)]:lg:col-start-2"
        >
          {activeServiceList.map((service, index) => (
            <ServiceCard
              key={`${activeTab}-${index}`}
              service={service}
              accent={accent}
              onLearnMore={toggleModalRoot}
            />
          ))}
        </motion.section>
      </AnimatePresence>

      {/* ── Modal ── */}
      <Modal ref={modalRootRef}>
        {selectedService && (
          <div className="font-[Poppins]">
            <p className="mb-4 text-lg font-bold leading-snug text-primary">
              {selectedService.learnMore?.intro}
            </p>
            <ul className="mb-4 list-none space-y-2 pl-0">
              {selectedService.learnMore?.points.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 text-primary">✦</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-500 italic">
              {selectedService.learnMore?.conclusion}
            </p>
          </div>
        )}
      </Modal>
    </article>
  );
};

/* ─────────────────────────────────────────
   Individual Service Card
───────────────────────────────────────── */
const ServiceCard = ({ service, accent, onLearnMore }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      className="group relative w-full max-w-sm cursor-default"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      {/* Gradient border glow — animates in on hover */}
      <motion.div
        className={`absolute -inset-[1.5px] rounded-[30px] bg-gradient-to-br ${accent.from} ${accent.to}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 0.75 : 0 }}
        transition={{ duration: 0.35 }}
      />

      {/* Card body */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b1c] px-6 py-12 flex flex-col items-center gap-8 backdrop-blur-sm">

        {/* Inner radial glow */}
        <motion.div
          className={`absolute -top-20 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gradient-to-br ${accent.from} ${accent.to} blur-3xl`}
          animate={{ opacity: hovered ? 0.2 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Decorative corner arc */}
        <div className={`absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-gradient-to-bl ${accent.from} ${accent.to} opacity-10`} />

        {/* Logo with ring on hover */}
        <div className="relative flex items-center justify-center">
          <motion.div
            className={`absolute inset-0 scale-125 rounded-full bg-gradient-to-br ${accent.from} ${accent.to} blur-xl`}
            animate={{ opacity: hovered ? 0.35 : 0, scale: hovered ? 1.4 : 1.25 }}
            transition={{ duration: 0.4 }}
          />
          <motion.div
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.35 }}
            className="relative z-10"
          >
            <Image
              className="h-auto w-auto"
              src={service.logo}
              alt={service.title}
              width={150}
              height={150}
            />
          </motion.div>
        </div>

        {/* Text */}
        <div className="space-y-3 text-center relative z-10 px-2">
          <h2 className="text-white text-lg font-extrabold capitalize tracking-tight">
            {service.title}
          </h2>
          <p className="text-sm leading-relaxed text-slate-400">
            {service.description}
          </p>
        </div>

        {/* Learn More CTA */}
        <motion.button
          onClick={() => onLearnMore(service)}
          className={`relative z-10 group/btn flex items-center gap-2 overflow-hidden rounded-full border px-6 py-2.5 text-sm font-bold text-white transition-colors duration-300`}
          style={{
            borderColor: hovered ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.12)",
            background: hovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
          }}
          whileTap={{ scale: 0.96 }}
        >
          {/* Shimmer sweep on hover */}
          <motion.span
            className={`absolute inset-0 bg-gradient-to-r ${accent.from} ${accent.to} opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300`}
          />
          <span className="relative z-10">Learn More</span>
          <motion.span
            className="relative z-10 inline-block"
            animate={{ x: hovered ? 3 : 0 }}
            transition={{ duration: 0.25 }}
          >
            →
          </motion.span>
        </motion.button>

        {/* Bottom edge bar — slides in on hover */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r ${accent.from} ${accent.to}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{ transformOrigin: "left center" }}
        />
      </div>
    </motion.div>
  );
};

export default ServiceCards;