"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/** Motion tokens, in GSAP units (seconds). */
export const motion = {
  easeOut: "expo.out",
  base: 0.3,
  reveal: 0.8,
  word: 0.9,
  staggerWords: 0.07,
  staggerBlocks: 0.09,
  revealOffset: 40,
  start: "top 85%",
} as const;

export const REDUCED = "(prefers-reduced-motion: reduce)";
export const FULL = "(prefers-reduced-motion: no-preference)";

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia(REDUCED).matches;

export { gsap, ScrollTrigger };
