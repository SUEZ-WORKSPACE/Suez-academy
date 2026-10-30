"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01";

/**
 * Text that decodes itself out of random glyphs when it enters the screen
 * (and again on hover). Screen readers always get the real text.
 */
export function Scramble({ text, className = "", as: Tag = "span" }: { text: string; className?: string; as?: "span" | "p" }) {
  const [shown, setShown] = useState(text);
  const ref = useRef<HTMLElement>(null);
  const raf = useRef(0);

  const run = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const dur = 600 + text.length * 18;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const fixed = Math.floor(p * text.length);
      setShown(
        text
          .split("")
          .map((ch, i) => (i < fixed || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(""),
      );
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        run();
        io.disconnect();
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <Tag ref={ref as never} className={className} onPointerEnter={run} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </Tag>
  );
}
