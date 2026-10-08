"use client";

import Image from "next/image";
import { motion } from "motion/react";

// Each card is rendered from this list — adding a project means adding an
// object here, not copying JSX. Optional fields (`award`, `role`) only render
// when present.
const projects = [
  {
    title: "ATS Resume Builder",
    description:
      "An AI-powered MERN app that scores resumes against real job descriptions, rewrites weak bullet points with Claude, and exports a clean, ATS-safe PDF. My first full-stack project — built, hardened, and shipped end to end.",
    image: "/project-ats-resume.png",
    imageAlt: "ATS Resume Builder landing page preview",
    techStack: ["React", "Node.js", "Express", "MongoDB", "Claude API", "JWT Auth", "Tailwind CSS", "Motion"],
    liveUrl: "https://ats-resume-builder-ten-xi.vercel.app",
    githubUrl: "https://github.com/priyanshu4849/ats-resume-builder",
  },
  {
    title: "SentraSec AI",
    award: "2nd Runner-Up · GDG Noida DevFest Buildathon 2025",
    description:
      "An AI-powered cybersecurity platform that puts four Gemini-backed tools in one dashboard: a phishing detector, a code vulnerability scanner, a cloud config risk analyzer, and a risk classifier.",
    role: "Team project · My role: product & pitch — shaping the feature set, testing the flows, and presenting it to the judges.",
    image: "/project-sentrasec.jpg",
    imageAlt: "SentraSec AI landing page preview",
    techStack: ["Next.js", "TypeScript", "FastAPI", "Python", "Gemini API", "Firebase", "Tailwind CSS"],
    liveUrl: "https://sec-sentra-ai-frontend.vercel.app",
    githubUrl: "https://github.com/Snehadas2005/devfest-security-suite",
  },
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

      <div className="mx-auto mt-10 flex max-w-4xl flex-col gap-10">
        {projects.map((project, i) => (
          <motion.article
            key={project.title}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            // Every other card flips the image to the right on desktop, so the
            // section reads as a zig-zag rather than a stack of identical boxes.
            className={`flex flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5 ${
              i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
            }`}
          >
            <motion.div variants={itemVariants} className="relative aspect-video w-full bg-black/25 lg:aspect-auto lg:w-1/2">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="flex w-full flex-col justify-center gap-4 p-6 sm:p-8 lg:w-1/2">
              <div>
                {project.award && (
                  <p className="mb-3 inline-block rounded-xl bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
                    {project.award}
                  </p>
                )}
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">{project.description}</p>
                {project.role && <p className="mt-3 text-sm text-foreground/50">{project.role}</p>}
              </div>

              <ul className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
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
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-85"
                >
                  Live site
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-foreground/5"
                >
                  GitHub
                </a>
              </div>
            </motion.div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
