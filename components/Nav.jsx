"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  // Closing the mobile menu collapses its height via AnimatePresence's exit
  // animation — if the browser's native anchor-scroll fires at the same
  // instant, it targets a layout that's still shifting, and the two end up
  // fighting each other (the hash updates but the page never actually
  // scrolls). Close the menu first, then scroll manually once the collapse
  // animation has had time to finish.
  function handleLinkClick(e, href) {
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between bg-background/60 px-6 py-4 text-white backdrop-blur-md sm:px-10">
        <a href="#hero" className="font-display font-bold tracking-tight" onClick={() => setOpen(false)}>
          Priyanshu
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 text-sm font-medium sm:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-white/80 transition-colors hover:text-white">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 sm:hidden"
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
            className="h-0.5 w-6 bg-white"
          />
          <motion.span
            animate={{ opacity: open ? 0 : 1 }}
            className="h-0.5 w-6 bg-white"
          />
          <motion.span
            animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
            className="h-0.5 w-6 bg-white"
          />
        </button>
      </nav>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden bg-background/90 text-white backdrop-blur-md sm:hidden"
          >
            {LINKS.map((link) => (
              <li key={link.href} className="border-t border-white/10">
                <a
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="block px-6 py-4 text-sm font-medium text-white/80 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
