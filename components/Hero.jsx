"use client";

import { useRef } from "react";
import Image from "next/image";
import Magnetic from "./Magnetic";
import usePrefersReducedMotion from "@/lib/usePrefersReducedMotion";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

// Slow at the start, fast in the middle, slow at the end. Used for the card so it
// eases into place instead of moving at one flat speed.
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Maps scroll progress onto a value: at `from` it returns `to[0]`, at `until` it returns
// `to[1]`, in between it moves in a straight line, and outside that range it stays put.
// Motion's own useTransform(value, [a, b], [c, d]) does the same job, but for opacity it
// hands the animation to the browser to run faster, and that faster version doesn't stay
// put past the end of the range: the corner text faded to 0 and then came back to 0.88
// by the end of the hero. Passing useTransform a plain function keeps it in Motion.
function between(p, from, until, to) {
  const t = Math.min(Math.max((p - from) / (until - from), 0), 1);
  return to[0] + (to[1] - to[0]) * t;
}

// How far the card's corners round off once it has finished shrinking.
const CARD_RADIUS = 28;

export default function Hero() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 150, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150, mass: 0.5 });

  function handleMouseMove(e) {
    const rect = stageRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  // The zoom out. The section is 230svh tall, but its inner "stage" is sticky and only
  // one screen tall, so the stage stays pinned to the screen for the extra 130svh of
  // scrolling. scrollYProgress goes from 0 (top of the page) to 1 (the moment the stage
  // unpins), and everything below is driven by that one number:
  //   0.00 to 0.18  the corner text and buttons fade out and drift down
  //   0.08 to 0.70  the video shrinks into a rounded card in the middle of the screen
  //   0.45 to 0.85  the big name fades and scales in above the card
  //   0.85 to 1.00  everything holds still for a moment, then the page carries on
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // Visitors who've turned on "reduce motion" get a normal one screen hero (the section's
  // motion-reduce:h-svh class) and a progress value stuck at 0, so nothing moves.
  const stillProgress = useMotionValue(0);
  const progress = reduceMotion ? stillProgress : scrollYProgress;

  const cornerOpacity = useTransform(progress, (p) => between(p, 0, 0.18, [1, 0]));
  const cornerY = useTransform(progress, (p) => between(p, 0, 0.18, [0, 40]));
  // Once the buttons have faded out, stop them catching clicks they can't be seen for.
  const cornerPointerEvents = useTransform(progress, (p) => (p > 0.15 ? "none" : "auto"));

  const scrimOpacity = useTransform(progress, (p) => between(p, 0.05, 0.45, [1, 0]));

  // `card` goes 0 -> 1 as the card forms. Everything about the card's shape reads from it.
  const card = useTransform(progress, (p) => easeInOutCubic(between(p, 0.08, 0.7, [0, 1])));
  // The card is cut out with clip-path: inset(top right bottom left round radius).
  // --card-top, --card-x and --card-bottom are the final gaps around the card, set per
  // screen size in the className below, so phones get a taller, narrower card. Clipping
  // the video (instead of resizing its box) means the browser never re-lays it out.
  const clipPath = useTransform(card, (c) =>
    `inset(calc(var(--card-top) * ${c}) calc(var(--card-x) * ${c}) calc(var(--card-bottom) * ${c}) calc(var(--card-x) * ${c}) round ${c * CARD_RADIUS}px)`
  );
  // The character shrinks a little inside the card, which is what makes it read as
  // zooming out rather than just being cropped.
  const videoScale = useTransform(card, (c) => between(c, 0, 1, [1, 0.88]));

  // The video's own background is the same charcoal as the page, so a bare clipped card
  // would melt into it. This empty box sits exactly on the card's edges and adds a thin
  // light border and a soft shadow. (A border on the clipped video itself would be
  // clipped away too.)
  const frameTop = useTransform(card, (c) => `calc(var(--card-top) * ${c})`);
  const frameBottom = useTransform(card, (c) => `calc(var(--card-bottom) * ${c})`);
  const frameX = useTransform(card, (c) => `calc(var(--card-x) * ${c})`);
  const frameRadius = useTransform(card, (c) => c * CARD_RADIUS);
  const frameOpacity = useTransform(progress, (p) => between(p, 0.08, 0.3, [0, 1]));

  const nameOpacity = useTransform(progress, (p) => between(p, 0.45, 0.8, [0, 1]));
  const nameScale = useTransform(progress, (p) => between(p, 0.45, 0.85, [0.92, 1]));
  const nameY = useTransform(progress, (p) => between(p, 0.45, 0.85, [24, 0]));

  // Each word fades up 0.08s after the one before it. This is a CSS animation
  // (animate-fade-up in globals.css), not Motion, so it starts as soon as the page
  // is drawn instead of waiting for JavaScript. motion-reduce:animate-none shows the
  // text straight away for visitors who've turned on "reduce motion".
  const headlineWords = "Hi, I'm Priyanshu.".split(" ");

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-[230svh] [--card-bottom:12svh] [--card-top:28svh] [--card-x:7vw] motion-reduce:h-svh sm:[--card-bottom:9svh] sm:[--card-top:26svh] sm:[--card-x:14vw] lg:[--card-bottom:8svh] lg:[--card-x:22vw]"
    >
      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        className="sticky top-0 flex h-svh w-full items-end justify-center overflow-hidden"
      >
        {/* Full-screen 3D version of me, an AI-animated 10s loop. The poster is the
            video's own first frame, so the swap from still to video is invisible.
            Visitors who've turned on "reduce motion" in their OS get only the still. */}
        <motion.div className="absolute inset-0" style={{ clipPath }}>
          <motion.div className="absolute inset-0" style={{ scale: videoScale }}>
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

          {/* Scrim so the corner text stays legible: one layer darkens the sides, one darkens
              the bottom, both fading into the page colour so the hero melts into the page.
              They fade away as the card forms, since the text they protect is gone by then. */}
          <motion.div style={{ opacity: scrimOpacity }} className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
          </motion.div>
        </motion.div>

        {/* The card's border and shadow (see frameTop above for why it's a separate box). */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/15"
          style={{
            top: frameTop,
            bottom: frameBottom,
            left: frameX,
            right: frameX,
            borderRadius: frameRadius,
            opacity: frameOpacity,
          }}
        />

        {/* Cursor-tracking glow, only on devices with a real hover pointer. Touchscreens never
            fire mousemove, so on a phone it would just sit stuck in the top-left corner */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute hidden h-96 w-96 rounded-full bg-gradient-to-br from-accent/25 via-accent/10 to-transparent blur-3xl [@media(hover:hover)]:block"
          style={{ left: springX, top: springY, x: "-50%", y: "-50%" }}
        />

        {/* The big name that appears above the finished card. It fills the gap between the
            nav bar and the card's top edge (the same --card-top gap). aria-hidden because the
            real heading is the h1 below; screen readers shouldn't hear the name twice. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 flex h-[var(--card-top)] items-end justify-center px-6 pb-[3svh] motion-reduce:hidden"
        >
          <motion.p
            style={{ opacity: nameOpacity, scale: nameScale, y: nameY }}
            className="font-display text-4xl font-bold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl"
          >
            Priyanshu <span className="text-accent">Saini</span>
          </motion.p>
        </div>

        <motion.div
          style={{ opacity: cornerOpacity, y: cornerY, pointerEvents: cornerPointerEvents }}
          className="relative z-10 flex w-full flex-col items-center gap-6 px-6 pb-16 text-center text-white sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:px-10 sm:pb-16 sm:text-left lg:px-16 lg:pb-20"
        >
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
              {/* Magnetic: the buttons lean toward the cursor (components/Magnetic.jsx) */}
              <Magnetic>
                <a
                  href="#projects"
                  className="block rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-85"
                >
                  See my work
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="/Priyanshu_Saini_Resume.pdf"
                  download
                  className="block rounded-full border border-white/30 bg-white/5 px-5 py-2.5 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/15"
                >
                  Resume ↓
                </a>
              </Magnetic>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
