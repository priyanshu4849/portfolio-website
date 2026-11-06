"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import SectionHeading from "./SectionHeading";

// `value` is the number that counts up; `prefix` is shown in front of it unchanged.
const stats = [
  { prefix: "~", value: 300, label: "people at TechSprint, our 36 hour offline hackathon" },
  { value: 12, label: "events so far, including hackathons, workshops and study jams" },
  { value: 26, label: "volunteers I coordinate" },
  { value: 100, label: "students who earned Google swag through the Solution Challenge" },
];

// A number that counts up from 0 the first time it scrolls into view.
function CountUp({ value, prefix = "", delay = 0 }) {
  const ref = useRef(null);
  // `once`: count up the first time only, not every time it scrolls past.
  // `amount: 0.6`: wait until most of the number is on screen, so the count isn't
  // half over before anyone sees it.
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();

  // The count lives in a motion value, not React state. Motion writes each new number
  // straight into the page, so React doesn't re-render 60 times a second.
  // It starts at the final value, so the HTML the server sends already says 300, 12, 26
  // and 100. That's what Google and visitors without JavaScript see.
  const count = useMotionValue(value);
  const rounded = useTransform(count, (v) => Math.round(v));

  // In the browser, drop it to 0 straight away so it can count up. This runs before the
  // section is anywhere near the screen, so nobody sees the jump from 300 to 0.
  useEffect(() => {
    if (!reduceMotion) count.set(0);
  }, [count, reduceMotion]);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    // Fast at the start, slowing down as it lands: the cubic bezier is a strong "ease out".
    const controls = animate(count, value, { duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, reduceMotion, count, value, delay]);

  return (
    <p ref={ref} className="font-display text-5xl font-bold tracking-tight text-accent tabular-nums sm:text-6xl lg:text-7xl">
      {/* Screen readers get the final number once, instead of every number on the way up. */}
      <span className="sr-only">
        {prefix}
        {value}
      </span>
      <span aria-hidden="true">
        {prefix}
        <motion.span>{rounded}</motion.span>
      </span>
    </p>
  );
}

const responsibilities = [
  "I handle event operations: venues, logistics, schedules and travel allowances.",
  "I stay in touch with speakers before and during every session.",
  "I give tasks to our 26 volunteers and follow up until they're done.",
];

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function Community() {
  return (
    <section id="community" className="border-b border-foreground/10 px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index="04"
          label="Community"
          title="Hackathons and workshops on campus."
          subtitle="What I do when I'm not coding."
        />

        {/* Role header with an accent rule, so it reads like an entry on a timeline. The rule
            draws downward first, then the text slides in beside it. */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="relative mt-10 pl-5"
        >
          <motion.span
            aria-hidden="true"
            variants={{
              hidden: { scaleY: 0 },
              show: { scaleY: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="absolute top-0 bottom-0 left-0 w-0.5 origin-top bg-accent"
          />
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -16 },
              show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 } },
            }}
          >
            <p className="text-xs font-medium uppercase tracking-widest text-accent">Since Sep 2025</p>
            <h3 className="mt-2 text-xl font-bold sm:text-2xl">Management Lead · GDG on Campus</h3>
            <p className="mt-1 text-sm text-foreground/60">
              Galgotias University · one of 8 core team members
            </p>
          </motion.div>
        </motion.div>

        {/* Big numbers that count up, each with a thin rule above it instead of a box */}
        <motion.ul
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <motion.li key={stat.label} variants={itemVariants} className="border-t border-foreground/15 pt-5">
              {/* Each number starts 0.15s after the one before it, so they land left to right */}
              <CountUp value={stat.value} prefix={stat.prefix} delay={i * 0.15} />
              <p className="mt-3 max-w-[14rem] text-sm leading-relaxed text-foreground/60">{stat.label}</p>
            </motion.li>
          ))}
        </motion.ul>

        <motion.ul
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-8 space-y-3"
        >
          {responsibilities.map((item) => (
            <motion.li key={item} variants={itemVariants} className="flex gap-3 text-sm text-foreground/70">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
