"use client";

import { motion } from "motion/react";

// One heading style for every section: a small code style label, the heading itself,
// and an optional subtitle that sits on the right on wider screens. Keeping it in one
// component means the sections can't drift apart.
//
// The heading slides up from behind an invisible edge (the outer span has overflow
// hidden, so the text is cut off until it rises into view). The trigger sits on the
// wrapper, not the text: while the text is pushed down out of its clipping box, the
// browser counts it as not visible at all, so it could never trigger its own reveal.
const reveal = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.25 } },
};

// The label carries on from the hero's intro, which types "> priyanshu.init()": every
// section is another call, like priyanshu.about(). Screen readers get the plain word
// ("About") instead of hearing "priyanshu dot about left paren right paren".
// The dimmed parts are at 50% because on black that's about 4.8:1, just over the
// 4.5:1 that text this small needs.
export function SectionLabel({ label, className = "" }) {
  return (
    <p className={`font-mono text-sm ${className}`}>
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">
        <span className="text-foreground/50">priyanshu.</span>
        <span className="text-accent">{label.toLowerCase()}</span>
        <span className="text-foreground/50">()</span>
      </span>
    </p>
  );
}

export default function SectionHeading({ label, title, subtitle }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8"
    >
      <div>
        <motion.div variants={fade}>
          <SectionLabel label={label} />
        </motion.div>
        <h2 className="mt-4 max-w-2xl text-4xl leading-[1.05] font-bold sm:text-5xl">
          {/* The bottom padding (cancelled by the negative margin) gives letters like "g"
              and "y" room below the line, so the clipping edge doesn't cut their tails. */}
          <span className="-mb-[0.15em] block overflow-hidden pb-[0.15em]">
            <motion.span variants={reveal} className="block">
              {title}
            </motion.span>
          </span>
        </h2>
      </div>
      {subtitle && (
        <motion.p variants={fade} className="max-w-xs text-sm text-foreground/60 sm:text-right">
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
