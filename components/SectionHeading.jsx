"use client";

import { motion } from "motion/react";

// One heading style for every section: a small numbered peach label, the
// heading itself, and an optional subtitle that sits on the right on wider
// screens. Keeping it in one component means the sections can't drift apart.
export default function SectionHeading({ index, label, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8"
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          {index} <span className="text-foreground/30">/</span> {label}
        </p>
        <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
      </div>
      {subtitle && <p className="max-w-xs text-sm text-foreground/60 sm:text-right">{subtitle}</p>}
    </motion.div>
  );
}
