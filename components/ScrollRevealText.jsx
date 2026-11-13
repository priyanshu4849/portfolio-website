"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import usePrefersReducedMotion from "@/lib/usePrefersReducedMotion";

// How bright a word is before its turn: dim enough that the lit words stand out,
// bright enough to stay readable. Readable has a number: on the black page, our
// off white text needs at least 37% opacity to reach a 3:1 contrast ratio, the
// minimum for large bold text (WCAG). At 0.15 it was 1.35:1, which Lighthouse flagged,
// since it checks the page before anyone scrolls. 0.4 gives 3.39:1.
const DIM = 0.4;

// A line of text where each word lights up, one after another, as the line scrolls up
// the screen. Scrolling back down dims it again. `as` picks the HTML tag (h2 by default),
// so the text keeps its meaning for screen readers and search engines: it's still one
// heading, just with each word wrapped in a <span>.
export default function ScrollRevealText({ text, as: Tag = "h2", className = "" }) {
  const ref = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  // 0 when the top of the text reaches 90% of the way down the screen, 1 when the bottom
  // of the text is 70% of the way down. Finishing that low matters: clicking "About" in
  // the nav puts the bottom of the About line about 65% down a short laptop screen, and
  // ending at 65% left the last word at 96% after the jump, so 70% leaves some margin.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.7"],
  });

  const words = text.split(" ");

  // Visitors who've turned on "reduce motion" just get the plain line, fully lit. It keeps
  // the ref so useScroll above still has an element to measure.
  if (reduceMotion) {
    return (
      <Tag ref={ref} className={className}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        // Word i gets its own slice of the progress: from i/n to (i+1)/n.
        // The space sits outside the span so lines can still wrap between words.
        <span key={i}>
          <Word progress={scrollYProgress} start={i / words.length} end={(i + 1) / words.length}>
            {word}
          </Word>{" "}
        </span>
      ))}
    </Tag>
  );
}

// Each word is its own component because useTransform is a hook, and hooks can't be
// called inside a loop. One component per word gives each word its own hook call.
function Word({ progress, start, end, children }) {
  // A plain function rather than useTransform(progress, [start, end], [DIM, 1]).
  // For opacity, Motion hands the array form to the browser to run, and that version
  // doesn't stay put outside the range (see between() in Hero.jsx).
  const opacity = useTransform(progress, (p) => {
    const t = Math.min(Math.max((p - start) / (end - start), 0), 1);
    return DIM + (1 - DIM) * t;
  });
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}
