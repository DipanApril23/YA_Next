"use client";
import { useRef, useImperativeHandle, forwardRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Modal = forwardRef(function Modal({ children }, ref) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useImperativeHandle(ref, () => ({
    toggle: () => setOpen((v) => !v),
  }));

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
      onClick={() => setOpen(false)}
    >
      {/* Modal panel */}
      <div
        className="relative w-full max-w-lg max-h-[88vh] flex flex-col rounded-[28px] border overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(14,14,24,0.98) 0%, rgba(8,8,18,0.99) 100%)",
          borderColor: "rgba(255,255,255,0.1)",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 40px 100px rgba(0,0,0,0.85), 0 0 60px rgba(168,85,247,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top glow bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.6), rgba(0,245,212,0.6), transparent)",
          }}
        />

        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.6)",
          }}
          aria-label="Close"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Scrollable content area */}
        <div
          className="overflow-y-auto flex-1 p-6 sm:p-8"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.1) transparent",
          }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.getElementById("portal-modal-root"),
  );
});

export default Modal;
