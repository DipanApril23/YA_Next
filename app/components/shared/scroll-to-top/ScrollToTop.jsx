"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  // Auto scroll to top on route change
  useEffect(() => {
    const hash = window.location.hash;
    
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className="group fixed bottom-24 right-6 z-9999 p-4 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95"
      aria-label="Scroll to top"
    >
      <svg
        className="w-5 h-5 transform group-hover:animate-bounce"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
};

export default ScrollToTop;