"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowUpRight, Sparkles } from "lucide-react";
import { NAV_ITEMS } from "./navData";

const SMOOTH_EASE = [0.16, 1, 0.3, 1];

const FAST_SPRING = {
  type: "spring",
  stiffness: 380,
  damping: 30,
};

export default function MobileSideBar({ isOpen, onClose }) {
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Reset dropdowns when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setActiveDropdown(null);
    }
  }, [isOpen]);

  const handleDropdownToggle = (e, label) => {
    e.preventDefault();
    e.stopPropagation();

    setActiveDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
  data-mobile-menu="true"
  onClick={(e) => e.stopPropagation()}
  initial={{ opacity: 0, y: 12, scale: 0.96 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: 8, scale: 0.96 }}
  transition={{
    duration: 0.22,
    ease: SMOOTH_EASE,
  }}
  className="
    fixed
    right-4
    top-[78px]
    z-50
    w-[250px]
    overflow-hidden
    rounded-[22px]
    border
    border-white/10
    bg-[#0d0d11e6]
    p-2
    shadow-[0_20px_48px_rgba(0,0,0,0.5),0_0_30px_rgba(139,92,246,0.08)]
    backdrop-blur-2xl
    min-[1100px]:hidden
    mt-2
  "
>
          {/* Scroll Area */}
          <div className="max-h-[55vh] space-y-0.5 overflow-y-auto pr-0.5">
            {NAV_ITEMS.map((item, idx) => {
              const hasDropdown = Boolean(item.dropdown?.length);
              const isSubOpen = activeDropdown === item.label;

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: idx * 0.03,
                    duration: 0.22,
                    ease: SMOOTH_EASE,
                  }}
                >
                  {hasDropdown ? (
                    <div className="overflow-hidden rounded-xl">
                      <button
                        type="button"
                        onClick={(e) =>
                          handleDropdownToggle(e, item.label)
                        }
                        className="
                          group
                          flex
                          w-full
                          items-center
                          justify-between
                          rounded-xl
                          px-3.5
                          py-2
                          text-left
                          transition-all
                          duration-200
                          hover:bg-white/5
                        "
                      >
                        <span
                          className="
                            text-[13px]
                            font-semibold
                            text-white/80
                            transition-colors
                            duration-200
                            group-hover:text-purple-400
                          "
                        >
                          {item.label}
                        </span>

                        <motion.div
                          animate={{
                            rotate: isSubOpen ? 180 : 0,
                          }}
                          transition={FAST_SPRING}
                          className={`
                            flex
                            h-5
                            w-5
                            items-center
                            justify-center
                            rounded-full
                            ${
                              isSubOpen
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-white/5 text-white/40"
                            }
                          `}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </motion.div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isSubOpen && (
                          <motion.div
                            initial={{
                              height: 0,
                              opacity: 0,
                            }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                            }}
                            transition={{
                              duration: 0.25,
                              ease: SMOOTH_EASE,
                            }}
                            className="overflow-hidden"
                          >
                            <div
                              className="
                                mx-1.5
                                mb-1.5
                                space-y-0.5
                                rounded-lg
                                border
                                border-white/5
                                bg-white/[0.01]
                                p-1
                              "
                            >
                              {item.dropdown?.map((sub) => {
                                const Icon = sub.icon;

                                return (
                                  <a
                                    key={sub.label}
                                    href={sub.href}
                                    onClick={onClose}
                                    className="
                                      group
                                      flex
                                      items-center
                                      gap-2.5
                                      rounded-md
                                      px-2.5
                                      py-1.5
                                      transition-all
                                      duration-200
                                      hover:bg-white/5
                                    "
                                  >
                                    <div
                                      className="
                                        flex
                                        h-5
                                        w-5
                                        items-center
                                        justify-center
                                        rounded-md
                                        bg-purple-500/15
                                        text-purple-400
                                      "
                                    >
                                      <Icon className="h-2.5 w-2.5" />
                                    </div>

                                    <span
                                      className="
                                        text-[11.5px]
                                        font-medium
                                        text-white/70
                                        transition-colors
                                        duration-200
                                        group-hover:text-white
                                      "
                                    >
                                      {sub.label}
                                    </span>
                                  </a>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      onClick={onClose}
                      className="
                        group
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        px-3.5
                        py-2
                        transition-all
                        duration-200
                        hover:bg-white/5
                      "
                    >
                      <span
                        className="
                          text-[13px]
                          font-semibold
                          text-white/80
                          transition-colors
                          duration-200
                          group-hover:text-purple-400
                        "
                      >
                        {item.label}
                      </span>

                      <ArrowUpRight
                        className="
                          h-3.5
                          w-3.5
                          -translate-x-1
                          text-white/40
                          opacity-0
                          transition-all
                          duration-300
                          group-hover:translate-x-0
                          group-hover:opacity-100
                        "
                      />
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-1.5 border-t border-white/10 pt-1.5">
            <motion.a
              whileTap={{ scale: 0.98 }}
              transition={FAST_SPRING}
              href="#contact"
              onClick={onClose}
              className="
                group
                relative
                flex
                w-full
                items-center
                justify-center
                gap-1.5
                overflow-hidden
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-purple-500
                py-2
                text-[11.5px]
                font-semibold
                text-white
                shadow-lg
                shadow-purple-500/10
              "
            >
              <div
                className="
                  absolute
                  inset-0
                  -translate-x-full
                  skew-x-12
                  bg-gradient-to-r
                  from-transparent
                  via-white/15
                  to-transparent
                  transition-transform
                  duration-700
                  group-hover:translate-x-full
                "
              />

              <span className="relative z-10">
                Contact Us
              </span>

              <Sparkles className="relative z-10 h-3 w-3 text-pink-300" />
            </motion.a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}