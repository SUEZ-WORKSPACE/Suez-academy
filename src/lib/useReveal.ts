"use client";

import { useEffect, useLayoutEffect, type RefObject } from "react";
import { FULL, REDUCED, ScrollTrigger, gsap, motion } from "./motion";

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Reveals every [data-reveal] element inside `scope` once, as it scrolls into view.
 * Content stays visible without JavaScript: the hidden state is set here, not in CSS.
 */
export function useReveal(scope: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useIsoLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add({ full: FULL, reduced: REDUCED }, (ctx) => {
      const { reduced } = ctx.conditions as { full: boolean; reduced: boolean };
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
      if (!items.length) return;

      gsap.set(items, reduced ? { opacity: 0 } : { opacity: 0, y: motion.revealOffset });
      ScrollTrigger.batch(items, {
        start: motion.start,
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: reduced ? motion.base : motion.reveal,
            ease: reduced ? "none" : motion.easeOut,
            stagger: reduced ? 0 : motion.staggerBlocks,
            overwrite: true,
            clearProps: "transform",
          }),
      });
    }, root);

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
