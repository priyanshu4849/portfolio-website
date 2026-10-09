"use client";

import Image from "next/image";
import { motion } from "motion/react";

const rightNow = [
  { label: "Studying", value: "CS at Galgotias University, Class of 2027" },
  { label: "Learning", value: "100xDevs cohort → Next.js, TypeScript, WebSockets" },
  { label: "Leading", value: "GDG on Campus, as Management Lead" },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
};

export default function About() {
  return (
    <section id="about" className="border-b border-foreground/10 px-6 py-24">
      {/* Editorial split: a big statement + photo on the left, the details on
          the right — a different shape from the centred sections around it */}
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-12 lg:gap-16">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="lg:col-span-5"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-accent">About me</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            I build AI-powered web apps &mdash; and the communities around them.
          </h2>
          <div className="relative mt-8 aspect-square w-40 overflow-hidden rounded-3xl ring-1 ring-foreground/10 sm:w-48">
            <Image
              src="/profile.jpg"
              alt="Priyanshu Saini at GDG Noida DevFest 2025"
              fill
              sizes="192px"
              className="object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="lg:col-span-7 lg:pt-9"
        >
          <p className="text-foreground/70">
            I&apos;m a CS student at Galgotias University (Class of 2027), building full stack apps with
            the MERN stack. My first real project was an AI powered resume builder that scores resumes
            against job descriptions and rewrites weak bullet points using Claude. I&apos;m currently
            deepening my MERN fundamentals through Harkirat Singh&apos;s 100xDevs cohort, with Next.js,
            TypeScript, and WebSockets coming up next.
          </p>
          <p className="mt-4 text-foreground/70">
            Outside of coursework, I&apos;m the Management Lead for GDG on Campus at Galgotias University,
            running technical events, hackathons, and workshops end to end &mdash; and I placed 2nd
            runner up at the GDG Noida DevFest Buildathon 2025 with SentraSec AI.
          </p>

          <dl className="mt-8 divide-y divide-foreground/10 border-y border-foreground/10">
            {rightNow.map((item) => (
              <div key={item.label} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
                <dt className="w-24 shrink-0 text-xs font-medium uppercase tracking-widest text-accent sm:pt-0.5">
                  {item.label}
                </dt>
                <dd className="text-sm text-foreground/80">{item.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
