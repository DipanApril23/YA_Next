"use client";
import { useRef, useState } from "react";
import { Navbar, MobileSidebar } from "./Navbar";

const Header = () => {
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return (
    <header className="bg-black">
      <MobileSidebar ref={sidebarRef} isOpen={isOpen} onClose={close} excludeRef={hamburgerRef} />
      <Navbar isOpen={isOpen} toggleSidebar={toggle} hamburgerRef={hamburgerRef} />
    </header>
  );
};

export default Header;
