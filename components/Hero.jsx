"use client";

import { useRef } from "react";
import Image from "next/image";
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
      className="relative flex h-screen w-full items-end justify-center overflow-hidden border-b border-foreground/10"
    >
      {/* Full-screen character — placeholder for the AI-generated video, same 16:9 frame it'll drop into */}
      <Image
        src="/hero-character.jpg"
        alt="3D animated character illustration"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* TODO: replace the <Image> above with <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" src="/hero-character.mp4" /> once the AI video is generated */}

      {/* Scrim so the overlaid text stays legible against any part of the image */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 via-40% to-black/60" />

      {/* Cursor-tracking glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute h-96 w-96 rounded-full bg-gradient-to-br from-red-500/25 via-orange-400/20 to-transparent blur-3xl"
        style={{ left: springX, top: springY, x: "-50%", y: "-50%" }}
      />

      <div className="relative z-10 w-full px-6 pb-20 text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-4xl font-bold sm:text-6xl"
        >
          Hi, I&apos;m Priyanshu.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="mx-auto mt-4 max-w-md text-lg text-white/80"
        >
          Full-stack developer building AI-powered web apps &mdash; MERN, Next.js, and a lot of debugging.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <a
            href="#projects"
            className="rounded-full bg-red-600 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-red-700"
          >
            View my work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/30 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-white/10"
          >
            Get in touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}
