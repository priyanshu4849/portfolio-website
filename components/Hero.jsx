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
  // one screen-height of scrolling), the character slowly zooms in and fades. The zoom
  // is kept small because the video is 720p and upscaling further looks soft.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const imageOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);

  const headlineWords = "Hi, I'm Priyanshu.".split(" ");
  const headlineContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const wordVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative flex h-svh w-full items-end justify-center overflow-hidden"
    >
      {/* Full-screen 3D version of me — an AI-animated 10s loop. The poster is the
          video's own first frame, so the swap from still to video is invisible.
          Visitors who've turned on "reduce motion" in their OS get only the still. */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: imageScale, opacity: imageOpacity }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.jpg"
          aria-hidden="true"
          className="h-full w-full object-cover motion-reduce:hidden"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <Image
          src="/hero-poster.jpg"
          alt="3D animated portrait of Priyanshu"
          fill
          priority
          sizes="100vw"
          className="hidden object-cover motion-reduce:block"
        />
      </motion.div>

      {/* Scrim so the overlaid text stays legible against any part of the image — two layers, since the text now sits in the bottom corners: one darkens the sides, one darkens the bottom. Both fade into the page background colour rather than black, so the hero melts into the About section with no hard edge */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />

      {/* Cursor-tracking glow — only on devices with a real hover pointer; touchscreens never fire
          mousemove, so on a phone it would just sit stuck in the top-left corner */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute hidden h-96 w-96 rounded-full bg-gradient-to-br from-accent/25 via-accent/10 to-transparent blur-3xl [@media(hover:hover)]:block"
        style={{ left: springX, top: springY, x: "-50%", y: "-50%" }}
      />

      <div className="relative z-10 flex w-full flex-col items-center gap-6 px-6 pb-16 text-center text-white sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:px-10 sm:pb-16 sm:text-left lg:px-16 lg:pb-20">
        <motion.h1
          variants={headlineContainer}
          initial="hidden"
          animate="show"
          className="flex max-w-xs flex-wrap justify-center gap-x-2 text-3xl font-bold sm:justify-start sm:text-4xl lg:max-w-sm lg:text-5xl"
        >
          {headlineWords.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariant}
              className={i === headlineWords.length - 1 ? "text-accent" : undefined}
            >
              {word}
            </motion.span>
          ))}
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
