"use client";

import Image from "next/image";
import { motion } from "motion/react";
import ScrollRevealText from "./ScrollRevealText";
import { SectionLabel } from "./SectionHeading";

const rightNow = [
  { label: "Studying", value: "CS at Galgotias University, Class of 2027" },
  { label: "Learning", value: "100xDevs cohort, with Next.js, TypeScript and WebSockets next" },
  { label: "Leading", value: "Management Lead at GDG on Campus" },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
};

export default function About() {
  return (
    <section id="about" className="border-b border-foreground/10 px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-5xl">
        {/* Same label as every other section (see SectionHeading.jsx). The heading
            itself is bigger here and lights up word by word as you scroll, so it's written
            out instead of using SectionHeading. */}
        <SectionLabel label="About" />
        <ScrollRevealText
          text="I build web apps and help run the Google developer club at my college."
          className="mt-6 max-w-4xl text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl"
        />

        {/* Under the statement: the photo on the left, the details on the right */}
        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* The photo wipes in from the bottom while the picture inside settles from a
              slight zoom, like a shutter opening. The "in view" trigger is on this column,
              not on the photo: while the photo is fully clipped, the browser counts it as
              not visible at all, so a trigger on the photo itself never fired and the photo
              stayed hidden. The column passes "show" down to the photo through variants. */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="lg:col-span-4"
          >
            <motion.div
              variants={{
                hidden: { clipPath: "inset(100% 0% 0% 0%)" },
                show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="relative aspect-square w-40 overflow-hidden rounded-3xl ring-1 ring-foreground/10 sm:w-56"
            >
              <motion.div
                variants={{
                  hidden: { scale: 1.15 },
                  show: { scale: 1, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="absolute inset-0"
              >
                <Image
                  src="/profile.jpg"
                  alt="Priyanshu Saini at GDG Noida DevFest 2025"
                  fill
                  sizes="224px"
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-8"
          >
            <p className="text-foreground/70">
              I&apos;m a CS student at Galgotias University, graduating in 2027. Most of what I build
              uses the MERN stack. My first real project was a resume builder: it compares your resume
              with a job description, gives it a score, and uses Claude to rewrite the weak bullet points.
              Right now I&apos;m going through Harkirat Singh&apos;s 100xDevs cohort to get better at the
              basics. Next.js, TypeScript and WebSockets come after that.
            </p>
            <p className="mt-4 text-foreground/70">
              Outside class, I&apos;m the Management Lead for GDG on Campus at Galgotias, so a lot of my
              time goes into planning hackathons and workshops and making sure they actually happen. At
              the GDG Noida DevFest Buildathon 2025, my team came 2nd runner up with SentraSec AI.
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
      </div>
    </section>
  );
}
