"use client";

import { useRef } from "react";
import { useReveal } from "@/lib/useReveal";
import { Hero } from "./Hero";
import { Cta, Method, TemplatesPreview, Ticker, Tracks, TunnelTeaser } from "./Sections";

export function HomeView() {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return (
    <div ref={ref}>
      <Hero />
      <Ticker />
      <Tracks />
      <TunnelTeaser />
      <Method />
      <TemplatesPreview />
      <Cta />
    </div>
  );
}
