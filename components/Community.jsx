"use client";

import { motion } from "motion/react";
import SectionHeading from "./SectionHeading";

const stats = [
  { value: "~300", label: "people at TechSprint, our 36 hour offline hackathon" },
  { value: "12", label: "events so far, including hackathons, workshops and study jams" },
  { value: "26", label: "volunteers I coordinate" },
  { value: "100", label: "students who earned Google swag through the Solution Challenge" },
];

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
    <section id="community" className="border-b border-foreground/10 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index="04"
          label="Community"
          title="Hackathons and workshops on campus."
          subtitle="What I do when I'm not coding."
        />

        {/* Role header with an accent rule, so it reads like an entry on a timeline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-10 border-l-2 border-accent pl-5"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-accent">Since Sep 2025</p>
          <h3 className="mt-2 text-xl font-bold sm:text-2xl">Management Lead · GDG on Campus</h3>
          <p className="mt-1 text-sm text-foreground/60">
            Galgotias University · one of 8 core team members
          </p>
        </motion.div>

        <motion.ul
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.li
              key={stat.label}
              variants={itemVariants}
              className="rounded-2xl border border-foreground/10 bg-foreground/5 p-5"
            >
              <p className="font-display text-3xl font-bold text-accent">{stat.value}</p>
              <p className="mt-2 text-xs leading-relaxed text-foreground/70">{stat.label}</p>
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
