"use client";

import { useEffect, useRef, useState } from "react";
import usePrefersReducedMotion from "@/lib/usePrefersReducedMotion";

// A small pixel art blob with a face that changes with the chat (components/AskWidget.jsx).
// It's drawn in code, on a 16 x 16 grid of squares, so each expression is just a different
// set of squares. `mood` picks the expression:
//   idle      open eyes, blinks now and then, eyes follow the cursor
//   happy     closed smiling eyes and pink cheeks
//   thinking  eyes glance up and to the side, small "o" mouth
//   talking   open eyes, mouth moving
//   sad       slanted eyes and a sweat drop
//
// The grid is 16 wide and 16 tall. One unit = one "pixel", scaled by `size`.

const EYES = {
  open: [
    [4, 6, 2, 2],
    [10, 6, 2, 2],
  ],
  blink: [
    [4, 7, 2, 1],
    [10, 7, 2, 1],
  ],
  // ^ ^
  happy: [
    [4, 7, 1, 1],
    [5, 6, 1, 1],
    [6, 7, 1, 1],
    [9, 7, 1, 1],
    [10, 6, 1, 1],
    [11, 7, 1, 1],
  ],
  // ˊ ˋ
  sad: [
    [4, 6, 1, 1],
    [5, 7, 1, 1],
    [11, 6, 1, 1],
    [10, 7, 1, 1],
  ],
};

export default function PixelBuddy({ mood = "idle", size = 56, className = "" }) {
  const reduceMotion = usePrefersReducedMotion();
  const ref = useRef(null);
  const [blink, setBlink] = useState(false);
  const [look, setLook] = useState([0, 0]); // where the eyes point, in pixels, -1 to 1

  // Blink every few seconds while idle (or talking). Random timing so it doesn't look
  // like a metronome. Reduce motion: no blinking at all.
  useEffect(() => {
    if (reduceMotion || !(mood === "idle" || mood === "talking")) return;
    let timer;
    const schedule = () => {
      timer = setTimeout(() => {
        setBlink(true);
        timer = setTimeout(() => {
          setBlink(false);
          schedule();
        }, 140);
      }, 2500 + Math.random() * 3000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [mood, reduceMotion]);

  // Eyes follow the mouse, by at most one pixel in each direction. Mouse only: on a
  // phone there's no cursor to follow.
  useEffect(() => {
    if (reduceMotion || mood !== "idle") return;
    let frame = 0;
    const onMove = (e) => {
      if (e.pointerType !== "mouse" || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        // Only the direction matters; the eyes move a whole pixel once the cursor is a
        // bit away from the face, so they don't jitter when it's close.
        const step = (d) => (Math.abs(d) < 40 ? 0 : Math.sign(d));
        setLook([step(dx), step(dy)]);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [mood, reduceMotion]);

  let eyes = EYES.open;
  let eyeShift = mood === "idle" ? look : [0, 0];
  if (mood === "happy") eyes = EYES.happy;
  else if (mood === "sad") eyes = EYES.sad;
  else if (mood === "thinking") eyeShift = [1, -1];
  else if (blink) eyes = EYES.blink;

  return (
    <svg
      ref={ref}
      viewBox="0 0 16 16"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      {/* The body: a rounded block with three stubby feet */}
      <g fill="var(--color-accent)">
        <rect x="4" y="2" width="8" height="1" />
        <rect x="3" y="3" width="10" height="1" />
        <rect x="2" y="4" width="12" height="7" />
        <rect x="3" y="11" width="10" height="1" />
        <rect x="3" y="12" width="2" height="2" />
        <rect x="7" y="12" width="2" height="2" />
        <rect x="11" y="12" width="2" height="2" />
      </g>
      {/* A lighter patch on the top left, like a highlight */}
      <rect x="4" y="3" width="2" height="1" fill="#fff" opacity="0.25" />

      {/* Cheeks, only when happy */}
      {mood === "happy" && (
        <g fill="#f08a7a" opacity="0.7">
          <rect x="3" y="8" width="1" height="1" />
          <rect x="12" y="8" width="1" height="1" />
        </g>
      )}

      {/* Eyes. The group slides by whole pixels when they look around. */}
      <g
        fill="#161616"
        style={{
          transform: `translate(${eyeShift[0]}px, ${eyeShift[1]}px)`,
          transition: reduceMotion ? "none" : "transform 120ms steps(2)",
        }}
      >
        {eyes.map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} />
        ))}
      </g>

      {/* Mouth: a small "o" while thinking, a moving mouth while talking, a flat line
          when sad. Nothing otherwise, like the calm face it's based on. */}
      {mood === "thinking" && <rect x="8" y="10" width="1" height="1" fill="#161616" />}
      {mood === "sad" && (
        <>
          <rect x="7" y="10" width="2" height="1" fill="#161616" />
          {/* sweat drop */}
          <rect x="13" y="3" width="1" height="2" fill="#9fd3ff" />
        </>
      )}
      {mood === "talking" && (
        <rect
          x="7"
          y="10"
          width="2"
          height="1"
          fill="#161616"
          className={reduceMotion ? "" : "animate-[buddy-talk_0.5s_steps(1)_infinite]"}
        />
      )}
    </svg>
  );
}
