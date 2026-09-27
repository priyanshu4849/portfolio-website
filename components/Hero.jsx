"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";

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

  // Parallax: as the hero scrolls out of view (progress 0 -> 1 over exactly
  // one screen-height of scrolling), the character slowly zooms in and fades.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const imageOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative flex h-screen w-full items-end justify-center overflow-hidden border-b border-foreground/10"
    >
      {/* Full-screen character — placeholder for the AI-generated video, same 16:9 frame it'll drop into */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: imageScale, opacity: imageOpacity }}
      >
        <Image
          src="/hero-character.jpg"
          alt="3D animated character illustration"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      {/* TODO: replace the <Image> above with <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" src="/hero-character.mp4" /> once the AI video is generated */}

      {/* Scrim so the overlaid text stays legible against any part of the image — two layers, since the text now sits in the bottom corners: one darkens the sides, one darkens the bottom */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Cursor-tracking glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute h-96 w-96 rounded-full bg-gradient-to-br from-red-500/25 via-orange-400/20 to-transparent blur-3xl"
        style={{ left: springX, top: springY, x: "-50%", y: "-50%" }}
      />

      <div className="relative z-10 flex w-full flex-col items-center gap-6 px-6 pb-16 text-center text-white sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:px-10 sm:pb-16 sm:text-left lg:px-16 lg:pb-20">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-xs text-3xl font-bold sm:text-4xl lg:max-w-sm lg:text-5xl"
        >
          Hi, I&apos;m Priyanshu.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="max-w-[15rem] text-base text-white/80 sm:text-right sm:text-lg lg:max-w-[17rem]"
        >
          Full-stack developer building AI-powered web apps &mdash; MERN, Next.js, and a lot of debugging.
        </motion.p>
      </div>
    </section>
  );
}
