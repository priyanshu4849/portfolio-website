import { useSyncExternalStore } from "react";

// Whether the visitor has turned on "reduce motion" in their OS settings, safe to use
// for choosing what to render.
//
// Motion's own useReducedMotion reads the real setting on the browser's very first
// render. The server can't know the setting, so it always renders the animated version;
// a component that rendered something different on that first pass (the plain About
// line, the static ATS walkthrough) didn't match the server's HTML, and React threw
// "Minified React error #418" (hydration mismatch) for those visitors.
//
// useSyncExternalStore fixes that: during hydration it uses the third function (the
// "server snapshot", always false here), so the first render matches the server. Right
// after, it re-renders with the real value, and it updates live if the setting changes.
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export default function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
