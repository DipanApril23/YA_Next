"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

export default function NavDropdown({ items, isOpen }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.22, ease: EASE }}
          className="absolute left-1/2 top-full z-50 mt-4 w-[320px] -translate-x-1/2"
        >
          <div className="absolute -top-[6px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-white/10 bg-[#050816]" />

          <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[#050816]/95 p-2 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
            {items.map((item, i) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={item.href}
                    className="group flex items-center gap-4 rounded-2xl border border-transparent px-4 py-3 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-300">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">
                        {item.label}
                      </span>

                      <span className="text-xs text-white/45">
                        {item.desc}
                      </span>
                    </div>

                    <ArrowUpRight className="ml-auto h-4 w-4 text-violet-300 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}