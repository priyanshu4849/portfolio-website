"use client";

import { motion } from "motion/react";
import SectionHeading from "./SectionHeading";

// Grouped by what each set of tools does, with where I've actually used it —
// more useful to a reader than a flat list of logos.
const groups = [
  {
    title: "Frontend",
    usedIn: "ATS Resume Builder, this portfolio",
    skills: ["React", "Next.js", "Tailwind CSS", "Motion"],
  },
  {
    title: "Backend",
    usedIn: "The ATS Resume Builder's API",
    skills: ["Node.js", "Express", "REST APIs", "JWT Auth"],
  },
  {
    title: "Data & AI",
    usedIn: "Resume scoring and bullet rewrites",
    skills: ["MongoDB", "Claude API"],
  },
  {
    title: "Tools",
    usedIn: "Every project",
    skills: ["Git & GitHub", "Postman", "Vercel"],
  },
];

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function Skills() {
  return (
    <section id="skills" className="border-b border-foreground/10 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index="02"
          label="Skills"
          title="What I work with."
          subtitle="Each group says where I've used it."
        />

        <motion.ul
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid gap-4 sm:grid-cols-2"
        >
          {groups.map((group) => (
            <motion.li
              key={group.title}
              variants={cardVariants}
              className="rounded-3xl border border-foreground/10 bg-foreground/5 p-6"
            >
              <h3 className="text-lg font-bold">{group.title}</h3>
              <p className="mt-1 text-xs text-foreground/50">Used in: {group.usedIn}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <motion.li
                    key={skill}
                    whileHover={{ scale: 1.08, backgroundColor: "rgba(232, 178, 143, 0.15)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="cursor-default rounded-full border border-foreground/15 bg-foreground/5 px-4 py-2 text-sm font-medium"
                  >
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
