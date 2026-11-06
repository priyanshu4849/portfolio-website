"use client";

import { motion, useReducedMotion, useSpring } from "motion/react";

// Wrap a button or link to make it lean toward the cursor, then spring back when the
// cursor leaves. `strength` is how far it follows: 0.3 means it moves 30% of the way
// from its centre toward the cursor. The move is capped at 8px sideways and 6px up or
// down: without the cap, a wide button (the 222px resume button) moved 29px and slid
// over the button next to it, which is only 12px away.
const MAX_X = 8;
const MAX_Y = 6;

function clamp(v, max) {
  return Math.min(Math.max(v, -max), max);
}
//
// Two layers on purpose: the outer span stays still and is what gets measured, the inner
// one moves. Measuring the moving element would make it chase its own position and jitter.
export default function Magnetic({ children, strength = 0.3, className = "" }) {
  const reduceMotion = useReducedMotion();
  const spring = { stiffness: 220, damping: 15, mass: 0.3 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  function handlePointerMove(e) {
    // Only for a real mouse or trackpad. On a phone, dragging a finger over a button
    // would otherwise drag the button around too.
    if (e.pointerType !== "mouse" || reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(clamp((e.clientX - (rect.left + rect.width / 2)) * strength, MAX_X));
    y.set(clamp((e.clientY - (rect.top + rect.height / 2)) * strength, MAX_Y));
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <span onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} className={`inline-block ${className}`}>
      <motion.span style={{ x, y }} className="block">
        {children}
      </motion.span>
    </span>
  );
}
