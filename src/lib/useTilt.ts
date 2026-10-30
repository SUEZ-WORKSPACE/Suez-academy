"use client";

import { useEffect, type RefObject } from "react";

/**
 * Leans a card toward the pointer (max `deg`) and feeds --mx / --my to the .spot glow.
 * Fine pointers only; off under reduced motion.
 */
export function useTilt(ref: RefObject<HTMLElement | null>, deg = 6) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      if (fine && !reduced) {
        el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * deg}deg) rotateY(${(px - 0.5) * deg}deg)`;
      }
    };
    const leave = () => {
      el.style.transform = "";
    };
    el.style.transition = "transform 300ms cubic-bezier(0.2,0,0,1)";
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [ref, deg]);
}
