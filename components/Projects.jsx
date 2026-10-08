"use client";

import Image from "next/image";
import { motion } from "motion/react";

const techStack = [
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "Claude API",
  "JWT Auth",
  "Tailwind CSS",
  "Motion",
];

const cardVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Projects() {
  return (
    <section id="projects" className="border-b border-foreground/10 px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.4 }}
        className="text-center text-3xl font-bold"
      >
        Projects
      </motion.h2>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto mt-10 flex max-w-4xl flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5 lg:flex-row"
      >
        <motion.div variants={itemVariants} className="relative aspect-video w-full bg-black/25 lg:aspect-auto lg:w-1/2">
          <Image
            src="/project-ats-resume.png"
            alt="ATS Resume Builder landing page preview"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="flex w-full flex-col justify-center gap-4 p-6 sm:p-8 lg:w-1/2">
          <div>
            <h3 className="text-xl font-bold">ATS Resume Builder</h3>
            <p className="mt-2 text-sm text-foreground/70">
              An AI-powered MERN app that scores resumes against real job descriptions, rewrites weak
              bullet points with Claude, and exports a clean, ATS-safe PDF. My first full-stack project
              &mdash; built, hardened, and shipped end to end.
            </p>
          </div>

          <ul className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-foreground/15 bg-foreground/5 px-3 py-1 text-xs font-medium"
              >
                {tech}
              </li>
            ))}
          </ul>

          <div className="mt-2 flex flex-wrap gap-3">
            <a
              href="https://ats-resume-builder-ten-xi.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              Live site
            </a>
            <a
              href="https://github.com/priyanshu4849/ats-resume-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-foreground/5"
            >
              GitHub
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
