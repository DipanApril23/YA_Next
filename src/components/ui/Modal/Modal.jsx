"use client";

// ─── Modal ────────────────────────────────────────────────────────────
// Portal-rendered dialog, used by the Services section's "Learn More".
//
// It renders into #portal-modal-root (declared in src/app/layout.js) rather
// than in place, so the dialog escapes any ancestor's `overflow: hidden`,
// `transform` or stacking context — a card deck that clips its own children
// would otherwise clip the modal too.
//
// The open/close API is IMPERATIVE, exposed through a ref
// (`toggle` / `open` / `close`) via useImperativeHandle, so a parent can drive
// it without threading state down. `mounted` guards the portal: document.body
// does not exist during the server render, so the portal is only created after
// the first client effect.

import { useRef, useImperativeHandle, forwardRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./modal.css";

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
      className="md-scrim fixed inset-0 z-[2000] flex items-center justify-center px-4"
      onClick={() => setOpen(false)}
    >
      {/* Modal panel */}
      <div
        className="md-panel relative w-full max-w-lg max-h-[88vh] flex flex-col rounded-[28px] border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top glow bar */}
        <div
          className="md-topglow absolute top-0 left-0 right-0 h-[1px]"
        />

        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="md-close absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          aria-label="Close"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Scrollable content area */}
        <div
          className="md-scroll overflow-y-auto flex-1 p-6 sm:p-8"
        >
          {children}
        </div>
      </div>
    </div>,
    document.getElementById("portal-modal-root"),
  );
});

export default Modal;
