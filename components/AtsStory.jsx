"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import usePrefersReducedMotion from "@/lib/usePrefersReducedMotion";

// The four steps of the ATS Resume Builder, each with a real screenshot of the app.
// The screenshots were taken on a local copy of the app with a made up sample resume
// (not my real one), in dark mode, and cropped to the app's content column.
const STEPS = [
  {
    title: "Upload your resume",
    text: "Drop in a PDF or DOCX. The server reads the text and sorts it into sections you can edit: experience, projects, education and skills.",
    image: "/ats-story/step-1.jpg",
    alt: "The resume editor after an upload, with template choices and the parsed name and email filled in",
  },
  {
    title: "Get a score",
    text: "Paste a job description and get a score out of 100. It is split into keywords, formatting, action verbs, measurable impact and length, so you can see what is pulling it down.",
    image: "/ats-story/step-2.jpg",
    alt: "An ATS score of 42 out of 100 with a bar for each part of the score",
  },
  {
    title: "See what is missing",
    text: "Keywords from the job are sorted into found and missing, and each weak bullet point is flagged with the reason it is weak.",
    image: "/ats-story/step-3.jpg",
    alt: "Keyword match showing 5 of 14 keywords found, and a list of weak bullet points with the reason for each",
  },
  {
    title: "Rewrite it for the job",
    text: "Claude rewrites the weak bullets and suggests the missing skills. Every change shows as a before and after, and nothing is saved until you click Apply.",
    image: "/ats-story/step-4.jpg",
    alt: "Each weak bullet crossed out with Claude's rewrite underneath, and missing skills ready to add",
  },
];

const APP_URL = "ats-resume-builder-ten-xi.vercel.app";

// The screenshots are 1400 x 1009, so the window keeps that shape.
const SHOT_ASPECT = "aspect-[1400/1009]";

export default function AtsStory() {
  const reduceMotion = usePrefersReducedMotion();
  // Visitors who've turned on "reduce motion" get the same four steps as a plain list.
  return reduceMotion ? <StaticStory /> : <PinnedStory />;
}

function PinnedStory() {
  const containerRef = useRef(null);
  const [active, setActive] = useState(0);

  // Same idea as the hero: the container is 380svh tall, but the stage inside it is
  // sticky and one screen tall, so it stays pinned for 280svh of scrolling.
  // scrollYProgress goes 0 -> 1 across that pinned stretch, and each step gets a
  // quarter of it.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  // `active` is React state (not a motion value) because it decides which step is
  // highlighted and which screenshot shows. It only changes 4 times, so the re-renders
  // are cheap. The CSS transitions on those elements do the actual fading.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(STEPS.length - 1, Math.floor(p * STEPS.length)));
  });

  // While the container scrolls up into view (its top going from the bottom of the
  // screen to the top), the window grows from 92% to full size and fades in.
  const { scrollYProgress: enterProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });
  // A plain function, not useTransform(value, [a, b], [c, d]). See between() in
  // Hero.jsx: the array form gets handed to the browser for opacity and doesn't clamp.
  const frameScale = useTransform(enterProgress, (p) => 0.92 + 0.08 * Math.min(Math.max(p, 0), 1));
  const frameOpacity = useTransform(enterProgress, (p) => Math.min(Math.max((p - 0.2) / 0.5, 0), 1));

  return (
    <div ref={containerRef} className="relative h-[380svh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center pt-16">
        <div className="grid items-center gap-6 lg:grid-cols-[2fr_3fr] lg:gap-12">
          {/* Left on desktop, below the window on phones (order-2) */}
          <div className="order-2 lg:order-1">
            <p className="text-xs font-medium uppercase tracking-widest text-accent">How it works</p>
            <h3 className="mt-2 text-2xl font-bold sm:text-3xl">From a PDF to a resume that fits the job.</h3>

            {/* Desktop: all four step titles, the current one bright and the rest dimmed, with
                a line on the left that fills as you scroll. Only the current step shows its
                description; with all four open, the column was taller than a laptop screen. */}
            <div className="relative mt-8 hidden lg:block">
              <div className="absolute top-0 bottom-0 left-0 w-px bg-foreground/10" />
              <motion.div
                className="absolute top-0 bottom-0 left-0 w-px origin-top bg-accent"
                style={{ scaleY: scrollYProgress }}
              />
              <ol className="flex flex-col gap-5 pl-6">
                {STEPS.map((step, i) => (
                  <li
                    key={step.title}
                    className={`transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-35"}`}
                  >
                    <h4 className="flex items-baseline gap-3 font-display text-lg font-bold">
                      <span className="text-sm text-accent">0{i + 1}</span>
                      {step.title}
                    </h4>
                    {/* Opens and closes smoothly. A grid row animating from 0fr to 1fr is the
                        CSS way to animate to "whatever height the text needs", which plain
                        height can't do (height: auto doesn't animate). */}
                    <div
                      className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                        i === active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <p className="overflow-hidden pl-8 text-sm leading-relaxed text-foreground/70">
                        <span className="block pt-2">{step.text}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Phones: there's no room for all four, so only the current step shows, with
                four small bars underneath for where you are. Stacking them in one grid cell
                keeps the height fixed at the tallest step, so nothing jumps as they swap. */}
            <div className="mt-5 lg:hidden">
              <div className="grid">
                {STEPS.map((step, i) => (
                  <div
                    key={step.title}
                    aria-hidden={i !== active}
                    className={`col-start-1 row-start-1 transition-opacity duration-500 ${
                      i === active ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <p className="font-display text-sm font-bold text-accent">0{i + 1}</p>
                    <h4 className="mt-1 font-display text-lg font-bold">{step.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/70">{step.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-1.5" aria-hidden="true">
                {STEPS.map((step, i) => (
                  <span
                    key={step.title}
                    className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                      i <= active ? "bg-accent" : "bg-foreground/15"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* On short laptop screens the window is limited by height, not width: its width
              is capped so that window + caption + the space for the nav always fit on screen.
              1.3875 is the screenshots' width divided by their height. 
              min-w-0 lets it shrink below the width of its contents; without it, the app
              address in the top bar pushed the window past the edge of a phone screen. */}
          <motion.div
            className="order-1 w-full min-w-0 justify-self-end lg:order-2 lg:max-w-[calc((100svh-10rem)*1.3875)]"
            style={{ scale: frameScale, opacity: frameOpacity }}
          >
            <AppWindow>
              {/* All four screenshots sit on top of each other and only the current one is
                  visible. The outgoing one fades out while growing slightly, the incoming one
                  fades in at normal size. */}
              {STEPS.map((step, i) => (
                <Image
                  key={step.image}
                  src={step.image}
                  alt={step.alt}
                  fill
                  sizes="(min-width: 1024px) 600px, 100vw"
                  aria-hidden={i !== active}
                  className={`object-cover object-top transition-[opacity,scale] duration-500 ease-out ${
                    i === active ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"
                  }`}
                />
              ))}
            </AppWindow>
            <Caption />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StaticStory() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-accent">How it works</p>
        <h3 className="mt-2 text-2xl font-bold sm:text-3xl">From a PDF to a resume that fits the job.</h3>
      </div>
      <ol className="flex flex-col gap-12">
        {STEPS.map((step, i) => (
          <li key={step.title} className="grid items-center gap-6 lg:grid-cols-[2fr_3fr] lg:gap-12">
            <div>
              <p className="font-display text-sm font-bold text-accent">0{i + 1}</p>
              <h4 className="mt-1 font-display text-lg font-bold">{step.title}</h4>
              <p className="mt-1 text-sm leading-relaxed text-foreground/70">{step.text}</p>
            </div>
            <AppWindow>
              <Image src={step.image} alt={step.alt} fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover object-top" />
            </AppWindow>
          </li>
        ))}
      </ol>
      <Caption />
    </div>
  );
}

// A simple browser window drawn in CSS: a top bar with three dots and the app's address,
// then the screenshot. The fade at the bottom is the app's own background colour, so a
// screenshot that's cut off at the bottom looks like a page you could keep scrolling.
function AppWindow({ children }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-[#020617] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
      <div className="flex h-8 items-center gap-3 border-b border-white/10 bg-white/5 px-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
        </div>
        <p className="mx-auto min-w-0 truncate rounded-md bg-white/5 px-3 py-0.5 text-[11px] text-foreground/50">{APP_URL}</p>
        {/* Balances the dots on the left so the address sits in the true middle */}
        <div className="w-[3.25rem]" aria-hidden="true" />
      </div>
      <div className={`relative ${SHOT_ASPECT} w-full`}>
        {children}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#020617] to-transparent" />
      </div>
    </div>
  );
}

function Caption() {
  return (
    <p className="mt-3 text-center text-xs text-foreground/40">
      Real screens from the app, using a made up sample resume.
    </p>
  );
}
