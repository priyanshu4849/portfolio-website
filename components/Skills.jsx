"use client";

import { motion } from "motion/react";

const skills = [
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "Tailwind CSS",
  "Framer Motion",
  "JWT Auth",
  "REST APIs",
  "Git & GitHub",
];

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function Skills() {
  return (
    <section id="skills" className="border-b border-foreground/10 px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-bold"
        >
          Skills
        </motion.h2>

        <motion.ul
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {skills.map((skill) => (
            <motion.li
              key={skill}
              variants={itemVariants}
              whileHover={{ scale: 1.08, backgroundColor: "rgba(220, 38, 38, 0.12)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="cursor-default rounded-full border border-foreground/15 bg-foreground/5 px-4 py-2 text-sm font-medium"
            >
              {skill}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
