"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import Magnetic from "./Magnetic";

// The 404 page. A huge "404" rises into view, and a soft peach light inside the digits
// follows the cursor (the same trick as the Skills tiles). On a phone the light just
// sits in the middle.

const ease = [0.16, 1, 0.3, 1];

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: (delay) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay, ease } }),
};

// The address the visitor asked for. This page is built once ahead of time, so the
// server doesn't know the address; only the browser does. The server snapshot (null)
// means the first render matches the built HTML, then the real address fills in.
// Reading it any other way would make React complain that the two don't match.
function subscribe() {
  return () => {};
}
function usePath() {
  return useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
    () => null,
  );
}

export default function NotFound() {
  const path = usePath();

  // Moves the light: the cursor position goes into two CSS variables on the number, so
  // moving the mouse never re-renders React. Mouse only, so a tap doesn't leave the light
  // stuck wherever the finger was.
  function handlePointerMove(e) {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <main className="flex flex-1 items-center px-6 pt-20 pb-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        {/* The big number is decoration (aria-hidden): the heading below says the same
            thing in words for screen readers. */}
        <div
          aria-hidden="true"
          onPointerMove={handlePointerMove}
          className="relative w-full select-none overflow-hidden pb-[0.04em]"
        >
          <motion.div
            initial={{ y: "105%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.1, ease }}
            // On wide screens the size also follows the screen height (34svh), so on a short
            // laptop the buttons still fit without scrolling.
            className="relative font-display text-[40vw] leading-[0.85] font-bold tracking-[-0.06em] sm:text-[min(15rem,32svh)] lg:text-[min(19rem,34svh)]"
          >
            {/* Base layer: the digits, barely lit */}
            <span className="block text-foreground/[0.07]">404</span>
            {/* Lit layer: the same digits on top, filled with a peach glow centred on the
                cursor. bg-clip-text paints the gradient only inside the letters. */}
            <span
              className="absolute inset-0 block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "radial-gradient(240px circle at var(--x, 50%) var(--y, 55%), rgba(232,178,143,0.95), rgba(232,178,143,0.25) 45%, transparent 75%)",
              }}
            >
              404
            </span>
          </motion.div>
        </div>

        <motion.p
          variants={fade}
          initial="hidden"
          animate="show"
          custom={0.45}
          className="mt-6 text-xs font-medium uppercase tracking-widest text-accent"
        >
          Error 404
        </motion.p>

        <motion.h1
          variants={fade}
          initial="hidden"
          animate="show"
          custom={0.55}
          className="mt-3 text-3xl leading-tight font-bold text-balance sm:text-5xl"
        >
          This page doesn&apos;t exist.
        </motion.h1>

        <motion.p
          variants={fade}
          initial="hidden"
          animate="show"
          custom={0.65}
          className="mt-4 max-w-md text-base text-balance text-foreground/60"
        >
          {/* The address appears once the browser has it. break-all keeps a very long
              address from pushing the page wider than a phone screen. */}
          {path && (
            <>
              Nothing lives at{" "}
              <code className="rounded-md bg-foreground/10 px-1.5 py-0.5 font-mono text-sm break-all text-foreground/80">
                {path}
              </code>
              .{" "}
            </>
          )}
          The link might be old, or the address has a typo. Everything I&apos;ve built is on
          the home page.
        </motion.p>

        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          custom={0.75}
          className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
        >
          <Magnetic className="w-full sm:w-auto">
            <Link
              href="/"
              className="block rounded-full bg-accent px-5 py-2.5 text-center text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              Back to home
            </Link>
          </Magnetic>
          <Magnetic className="w-full sm:w-auto">
            <Link
              href="/#projects"
              className="block rounded-full border border-foreground/15 bg-foreground/5 px-5 py-2.5 text-center text-sm font-medium transition-colors hover:bg-foreground/10"
            >
              See my projects
            </Link>
          </Magnetic>
        </motion.div>
      </div>
    </main>
  );
}
