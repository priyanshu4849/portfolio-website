"use client";

import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import Lenis from "lenis";

// Site-wide setup that has to run in the browser, wrapped around every page in layout.js.
export default function Providers({ children }) {
  // Smooth scrolling. Lenis catches mouse wheel and trackpad scrolls and eases the page
  // toward where you scrolled, instead of jumping in steps. It still moves the real
  // window scroll, so everything that listens to scrolling (Motion's useScroll in the
  // hero, the ATS walkthrough, the About line) keeps working.
  //   autoRaf: Lenis runs its own animation loop, so nothing else has to drive it.
  //   anchors: links like href="#about" glide there too. Lenis reads each section's
  //            scroll-margin-top (4.5rem in globals.css), so they stop just below the nav.
  //            Adding an offset here as well doubled the gap to 144px.
  // Lenis leaves touch scrolling alone (phones keep their own momentum scrolling) and
  // turns itself off when "reduce motion" is on.
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, anchors: true });
    return () => lenis.destroy();
  }, []);

  // reducedMotion="user": when someone has turned on "reduce motion", Motion skips
  // movement (sliding, scaling) in every animation on the site and only keeps fades.
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
