"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FULL, REDUCED, gsap, motion } from "@/lib/motion";
import { useIsoLayoutEffect } from "@/lib/useReveal";
import { Terminal } from "./Terminal";

const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), { ssr: false });

const VERBS = [
  { word: "programar", cls: "text-fn" },
  { word: "proteger", cls: "text-kw" },
  { word: "automatizar", cls: "text-str" },
  { word: "lançar", cls: "text-num" },
  { word: "liderar", cls: "text-type" },
];

/** Types and deletes the verb of the headline, like someone editing a line of code. */
function Verb() {
  const [i, setI] = useState(0);
  const [text, setText] = useState(VERBS[0].word);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      let k = 0;
      await wait(2600);
      while (alive) {
        const cur = VERBS[k % VERBS.length].word;
        for (let n = cur.length; n >= 0 && alive; n--) {
          setText(cur.slice(0, n));
          await wait(40);
        }
        k++;
        setI(k % VERBS.length);
        const next = VERBS[k % VERBS.length].word;
        for (let n = 1; n <= next.length && alive; n++) {
          setText(next.slice(0, n));
          await wait(70);
        }
        await wait(2200);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <span className={`caret caret-thin ${VERBS[i].cls}`} aria-hidden="true">
      {text}
    </span>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add({ full: FULL, reduced: REDUCED }, (ctx) => {
      const { reduced } = ctx.conditions as { full: boolean; reduced: boolean };
      const tl = gsap.timeline({ defaults: { ease: motion.easeOut } });
      if (reduced) {
        tl.from("[data-hero]", { opacity: 0, duration: motion.base });
        return;
      }
      tl.from("[data-word]", { yPercent: 110, duration: motion.word, stagger: motion.staggerWords }, 0.15)
        .from("[data-hero]", { opacity: 0, y: 24, duration: 0.7, stagger: 0.1 }, 0.55)
        .from("[data-term]", { opacity: 0, y: 40, rotateX: 18, transformPerspective: 900, duration: 1.1 }, 0.5);
    }, el);
    return () => mm.revert();
  }, []);

  const title = ["Aprende", "a"];

  return (
    <section
      ref={root}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28"
      data-bit="Este terminal funciona mesmo. Experimenta `ls` ou `cd devops` 😎"
    >
      <HeroScene className="absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ground to-transparent" />

      <div className="shell grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p data-hero className="t-label mb-6 inline-flex items-center gap-2 rounded border border-line-strong bg-ground/60 px-3 py-1.5 text-ink-soft backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-str shadow-[0_0_10px_var(--str)]" />
            inscrições abertas · Luanda · presencial e online
          </p>
          <h1 className="t-display !text-[clamp(2.75rem,6.6vw,6.5rem)]" aria-label="Aprende a programar o futuro de Angola.">
            <span className="whitespace-nowrap">
              {title.map((w) => (
                <span key={w} className="mr-[0.22em] inline-block overflow-hidden pb-[0.06em] align-bottom">
                  <span data-word className="inline-block">{w}</span>
                </span>
              ))}
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-word className="inline-block min-h-[1em]">
                <Verb />
              </span>
            </span>
            <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
              <span data-word className="inline-block">
                o futuro<span className="text-suez">.</span>
              </span>
            </span>
          </h1>
          <p data-hero className="t-lead mt-8">
            A escola prática da Suez Inovações. Aprendes código, cloud, redes, segurança e produto com quem constrói
            sistemas reais para a banca e as empresas angolanas.
          </p>
          <div data-hero className="mt-10 flex flex-wrap gap-3">
            <Link href="/contactos?inscricao=1" className="btn max-sm:w-full max-sm:justify-center">
              Quero inscrever-me <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <Link href="/aprender" className="btn btn-ghost max-sm:w-full max-sm:justify-center">
              <span className="t-mono text-suez">▶</span> Entrar no túnel
            </Link>
          </div>
        </div>

        <div data-term className="lg:col-span-5">
          <Terminal />
        </div>
      </div>

      <a href="#trilhas" className="t-label absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-ink-faint hover:text-suez md:flex">
        scroll
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-suez to-transparent" />
      </a>
    </section>
  );
}
