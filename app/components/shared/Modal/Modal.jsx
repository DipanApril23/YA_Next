"use client";
import { useRef, useImperativeHandle, forwardRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

const Modal = forwardRef(function Modal({ children }, ref) {
  const modalRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useImperativeHandle(ref, () => ({
    toggle: () => {
      modalRef.current?.classList.toggle("opacity-0");
      modalRef.current?.classList.toggle("invisible");
    },
  }));

  if (!mounted) return null;

  return createPortal(
    <main
      ref={modalRef}
      className="invisible fixed inset-0 z-2000 flex h-screen w-full items-center justify-center bg-black/60 opacity-0 transition-all duration-200"
    >
      <article className={`${css.modalContainer} flex h-[95vh] items-center justify-center`}>
        <section className="flex max-h-full w-full flex-col rounded bg-white">
          <div className="flex justify-end border-b border-gray-300 p-4">
            <button
              onClick={() => ref.current.toggle()}
              className="group rounded bg-white px-1.5 hover:bg-primary"
            >
              <i className="fa-solid fa-xmark text-primary group-hover:text-white"></i>
            </button>
          </div>
          <div className="custom-scrollbar overflow-auto p-4">{children}</div>
        </section>
      </article>
    </main>,
    document.getElementById("portal-modal-root"),
  );
});

export default Modal;
