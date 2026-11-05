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

  // Each word fades up 0.08s after the one before it. This is a CSS animation
  // (animate-fade-up in globals.css), not Motion, so it starts as soon as the page
  // is drawn instead of waiting for JavaScript. motion-reduce:animate-none shows the
  // text straight away for visitors who've turned on "reduce motion".
  const headlineWords = "Hi, I'm Priyanshu.".split(" ");

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
          {/* A phone held upright only ever shows the middle third of the wide video, so
              tall screens get a portrait crop of just that middle (hero-mobile.mp4, ~1 MB
              instead of ~3 MB, same pixels on screen). The browser uses the first <source>
              whose media query matches. The wide one is listed first so a browser too old
              to understand `media` falls back to it rather than to the narrow crop. */}
          <source src="/hero.mp4" type="video/mp4" media="(min-aspect-ratio: 9/16)" />
          <source src="/hero-mobile.mp4" type="video/mp4" />
        </video>
        {/* `unoptimized` keeps the URL exactly /hero-poster.jpg, the same file the video's
            poster uses. `preload` then loads that one file early, so the poster (the
            biggest thing on screen) shows sooner and is only downloaded once. Without it,
            Next.js would preload a resized copy at a different URL that most visitors never see.
            (`preload` replaced the older `priority` prop in Next.js 16.) */}
        <Image
          src="/hero-poster.jpg"
          alt="3D animated portrait of Priyanshu"
          fill
          preload
          unoptimized
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
        <h1 className="flex max-w-xs flex-wrap justify-center gap-x-2 text-3xl font-bold sm:justify-start sm:text-4xl lg:max-w-sm lg:text-5xl">
          {headlineWords.map((word, i) => (
            <span
              key={i}
              className={`animate-fade-up motion-reduce:animate-none ${
                i === headlineWords.length - 1 ? "text-accent" : ""
              }`}
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              {word}
            </span>
          ))}
        </h1>
        <div
          className="flex animate-fade-up flex-col items-center gap-5 motion-reduce:animate-none sm:items-end"
          style={{ animationDuration: "0.5s", animationDelay: "0.1s" }}
        >
          <p className="max-w-[15rem] text-base text-white/80 sm:text-right sm:text-lg lg:max-w-[17rem]">
            CS student who builds full stack web apps with MERN and Next.js.
          </p>
          {/* Two clear next steps for a visitor: see the work, or grab the resume.
              `download` makes the browser save the PDF instead of navigating to it. */}
          <div className="flex gap-3">
            <a
              href="#projects"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              See my work
            </a>
            <a
              href="/Priyanshu_Saini_Resume.pdf"
              download
              className="rounded-full border border-white/30 bg-white/5 px-5 py-2.5 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              Resume ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
