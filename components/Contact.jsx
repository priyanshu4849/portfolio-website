"use client";

import { motion } from "motion/react";

const links = [
  { label: "priyanshusaini4849@gmail.com", href: "mailto:priyanshusaini4849@gmail.com" },
  { label: "GitHub — @priyanshu4849", href: "https://github.com/priyanshu4849" },
  { label: "LinkedIn — Priyanshu Saini", href: "https://www.linkedin.com/in/priyanshu-saini-90ab17270" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Contact() {
  return (
    <section id="contact" className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
      >
        <motion.h2 variants={item} className="text-3xl font-bold sm:text-4xl">
          Let&apos;s build something.
        </motion.h2>
        <motion.p variants={item} className="mx-auto mt-4 max-w-sm text-foreground/70">
          Open to internships and interesting problems. Reach out, or just say hi.
        </motion.p>

        <motion.div variants={item} className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="rounded-full border border-foreground/15 bg-foreground/5 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-foreground/10"
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-16 text-xs text-foreground/40"
      >
        Built with Next.js, Tailwind CSS, and Motion.
      </motion.p>
    </section>
  );
}
