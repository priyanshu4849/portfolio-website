"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#community", label: "Community" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  // The nav also shows on the 404 page, where there's no #about to scroll to. Off the
  // home page every link points back home first ("/#about"), and the browser opens the
  // home page at that section.
  const onHome = usePathname() === "/";
  const to = (hash) => (onHome ? hash : `/${hash}`);

  // Closing the mobile menu collapses its height via AnimatePresence's exit
  // animation — if the browser's native anchor-scroll fires at the same
  // instant, it targets a layout that's still shifting, and the two end up
  // fighting each other (the hash updates but the page never actually
  // scrolls). Close the menu first, then scroll manually once the collapse
  // animation has had time to finish.
  function handleLinkClick(e, href) {
    // Off the home page, let the link do a normal page load to "/#section"
    if (!onHome) {
      setOpen(false);
      return;
    }
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between bg-background/60 px-6 py-4 text-white backdrop-blur-md sm:px-10">
        <a href={onHome ? "#hero" : "/"} className="font-display font-bold tracking-tight" onClick={() => setOpen(false)}>
          Priyanshu
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 text-sm font-medium sm:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              {/* The peach underline is an ::after line scaled to 0 width, growing from the
                  left on hover */}
              <a
                href={to(link.href)}
                className="relative text-white/80 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100"
              >
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
                  href={to(link.href)}
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
