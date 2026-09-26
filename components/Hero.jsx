"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Hero() {
  const sectionRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 150, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150, mass: 0.5 });

  function handleMouseMove(e) {
    const rect = sectionRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden border-b border-foreground/10"
    >
      {/* Cursor-tracking glow — follows the mouse with a spring lag, like the reel's interactive element */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute w-80 h-80 rounded-full bg-gradient-to-br from-red-500/25 via-orange-400/20 to-transparent blur-3xl"
        style={{ left: springX, top: springY, x: "-50%", y: "-50%" }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col-reverse items-center justify-center gap-12 px-6 py-20 lg:flex-row lg:justify-between">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md text-center lg:text-left"
        >
          <h1 className="text-4xl font-bold sm:text-5xl">
            Hi, I&apos;m Priyanshu.
          </h1>
          <p className="mt-4 text-lg text-foreground/70">
            Full-stack developer building AI-powered web apps &mdash; MERN, Next.js, and a lot of debugging.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="#projects"
              className="rounded-full bg-red-600 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-red-700"
            >
              View my work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-foreground/20 px-6 py-3 text-center font-medium transition-colors hover:bg-foreground/5"
            >
              Get in touch
            </a>
          </div>
        </motion.div>

        {/* AI character video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="relative aspect-[9/16] w-64 shrink-0 overflow-hidden rounded-3xl border border-foreground/15 shadow-2xl sm:w-72"
        >
          {/* TODO: replace with <video autoPlay muted loop playsInline src="/hero-character.mp4" /> once generated */}
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-500 via-orange-400 to-amber-300 p-6 text-center">
            <span className="text-sm font-medium text-white/90">
              AI character video goes here
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
