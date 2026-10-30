"use client";

import { useRef } from "react";
import { FULL, REDUCED, gsap, motion } from "@/lib/motion";
import { useIsoLayoutEffect, useReveal } from "@/lib/useReveal";
import { Mark } from "./Logo";
import { Scramble } from "./Scramble";

/** Wraps a page so every [data-reveal] inside it reveals on scroll. */
export function PageShell({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return <div ref={ref}>{children}</div>;
}

/** Page title block: the title rises word by word out of a mask. */
export function PageIntro({
  label,
  title,
  lead,
  bit,
  children,
}: {
  label: string;
  title: string;
  lead?: string;
  bit?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add({ full: FULL, reduced: REDUCED }, (ctx) => {
      const { reduced } = ctx.conditions as { full: boolean; reduced: boolean };
      if (reduced) {
        gsap.from("[data-intro]", { opacity: 0, duration: motion.base });
        return;
      }
      gsap
        .timeline({ defaults: { ease: motion.easeOut } })
        .from("[data-w]", { yPercent: 110, duration: motion.word, stagger: motion.staggerWords })
        .from("[data-intro]", { opacity: 0, y: 24, duration: 0.7, stagger: 0.1 }, 0.35)
        .from("[data-mark]", { opacity: 0, rotate: -90, scale: 0.6, duration: 1.6 }, 0);
    }, el);
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className="relative isolate overflow-hidden pb-16 pt-[clamp(140px,16vw,200px)]" data-bit={bit}>
      <div className="grid-bg absolute inset-0 -z-10" />
      <span data-mark className="absolute -right-20 top-10 -z-10 block opacity-25 sm:right-[4%]">
        <Mark className="h-[300px] w-[300px] text-suez sm:h-[440px] sm:w-[440px]" />
      </span>
      <div className="shell grid gap-6">
        <Scramble text={label} className="t-label text-suez" />
        <h1 className="t-h1 max-w-[20ch]" aria-label={title}>
          {title.split(" ").map((w, i) => (
            <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden="true">
              <span data-w className="inline-block">
                {w}
              </span>
            </span>
          ))}
        </h1>
        {lead ? (
          <p data-intro className="t-lead">
            {lead}
          </p>
        ) : null}
        {children ? <div data-intro>{children}</div> : null}
      </div>
    </section>
  );
}
