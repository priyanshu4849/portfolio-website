"use client";

import { motion, useScroll } from "motion/react";

export default function ScrollProgress() {
  // No `target` passed to useScroll — tracks the whole page's scroll
  // progress (0 at the top, 1 at the bottom), not just one section.
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-accent"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
