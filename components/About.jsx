"use client";

import { motion } from "motion/react";

export default function About() {
  return (
    <section
      id="about"
      className="border-b border-foreground/10 px-6 py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center sm:flex-row sm:items-start sm:text-left"
      >
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-amber-400 text-3xl font-bold text-white">
          PS
        </div>

        <div>
          <h2 className="text-3xl font-bold">About me</h2>
          <p className="mt-4 text-foreground/70">
            I&apos;m a full-stack developer learning by building &mdash; my first real project was an
            AI-powered resume builder (MERN stack) that scores resumes against job descriptions and
            rewrites weak bullet points using Claude. I&apos;m currently deepening my MERN fundamentals
            through a structured course, with Next.js, TypeScript, and WebSockets coming up next.
          </p>
          <p className="mt-4 text-foreground/70">
            I like projects that force me to actually understand something &mdash; not just follow a
            tutorial &mdash; which is how most of the real bugs (and real lessons) on this site and my
            other projects got found.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
