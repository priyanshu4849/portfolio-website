"use client";

import { motion } from "motion/react";
import SectionHeading from "./SectionHeading";

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
    <section id="contact" className="px-6 pt-24 pb-12">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index="05"
          label="Contact"
          title="Looking for an internship."
          subtitle="I'm a CS student (Class of 2027) who builds full stack apps and actually ships them. If you're hiring interns, I'd love to talk."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
        >
          {/* The resume leads, since it's the one thing most recruiters want */}
          <motion.a
            variants={item}
            href="/Priyanshu_Saini_Resume.pdf"
            download
            className="rounded-full bg-accent px-5 py-2.5 text-center text-sm font-medium text-background transition-opacity hover:opacity-85"
          >
            Download my resume (PDF)
          </motion.a>
          {links.map((link) => (
            <motion.a
              key={link.href}
              variants={item}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="rounded-full border border-foreground/15 bg-foreground/5 px-5 py-2.5 text-center text-sm font-medium transition-colors hover:bg-foreground/10"
            >
              {link.label}
            </motion.a>
          ))}
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-24 flex flex-col gap-2 border-t border-foreground/10 pt-6 text-xs leading-relaxed text-foreground/40 sm:flex-row sm:justify-between"
        >
          <p>Built with Next.js, Tailwind CSS, and Motion.</p>
          <p>The 3D me in the hero was generated and animated with Google Flow.</p>
        </motion.footer>
      </div>
    </section>
  );
}
