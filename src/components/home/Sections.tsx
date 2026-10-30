"use client";

import Link from "next/link";
import { useRef } from "react";
import { method, stackTicker, templates, tracks, type Track } from "@/content/academy";
import { say } from "@/lib/bit";
import { FULL, ScrollTrigger, gsap } from "@/lib/motion";
import { useIsoLayoutEffect } from "@/lib/useReveal";
import { useTilt } from "@/lib/useTilt";
import { Code, Window } from "@/components/site/Code";
import { Scramble } from "@/components/site/Scramble";
import { Mark } from "@/components/site/Logo";
import { TemplateCard } from "@/components/templates/TemplateCard";

export const toneVar = (tone: Track["tone"]) => (tone === "accent" ? "var(--suez)" : `var(--${tone})`);

export function Ticker() {
  const items = [...stackTicker, ...stackTicker];
  return (
    <div className="relative overflow-hidden border-y border-line bg-surface py-5" aria-label="Tecnologias que vais usar">
      <div className="ticker gap-10 pr-10">
        {items.map((s, i) => (
          <span key={i} className="t-mono flex shrink-0 items-center gap-10 text-[0.9375rem] text-ink-soft" aria-hidden={i >= stackTicker.length}>
            {s}
            <span className="text-suez">✦</span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface to-transparent" />
    </div>
  );
}

function SectionHead({ label, title, lead }: { label: string; title: string; lead?: string }) {
  return (
    <div className="mb-14 grid gap-5 md:mb-20">
      <Scramble text={label} className="t-label text-suez" />
      <h2 data-reveal className="t-h2 max-w-[22ch]" style={{ hyphens: "manual" }}>{title}</h2>
      {lead ? <p data-reveal className="t-lead">{lead}</p> : null}
    </div>
  );
}

export function TrackCard({ track }: { track: Track }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useTilt(ref, 7);
  return (
    <Link
      ref={ref}
      href={`/formacoes/${track.slug}`}
      data-reveal
      onPointerEnter={() => say(`${track.title.split(":")[0]}? Excelente escolha 👀`, "think")}
      className="spot group grid min-h-[420px] content-between gap-8 rounded-lg border border-line bg-surface p-6 transition-colors hover:border-[var(--tone)] sm:p-7"
      style={{ "--tone": toneVar(track.tone) } as React.CSSProperties}
    >
      <div className="flex items-start justify-between">
        <span className="t-label text-ink-faint">trilha/{track.code}</span>
        <span
          className="t-mono grid h-12 w-12 place-items-center rounded border border-line-strong text-[1.25rem] transition-transform duration-500 group-hover:rotate-[360deg]"
          style={{ color: toneVar(track.tone) }}
          aria-hidden="true"
        >
          {track.glyph}
        </span>
      </div>
      <div className="grid gap-3">
        <h3 className="t-h3">{track.title}</h3>
        <p className="text-[0.9375rem] text-ink-soft">{track.short}</p>
      </div>
      <div className="overflow-hidden rounded border border-line bg-ground">
        <p className="t-label border-b border-line px-3 py-2 text-ink-faint">{track.file}</p>
        <Code lines={track.snippet} numbers={false} className="px-3 py-3 !text-[0.75rem]" />
      </div>
      <span className="t-mono flex items-center gap-2 text-[0.8125rem]" style={{ color: toneVar(track.tone) }}>
        ver programa <span className="transition-transform duration-200 group-hover:translate-x-1.5">→</span>
      </span>
    </Link>
  );
}

export function Tracks() {
  return (
    <section id="trilhas" className="section relative" data-bit="Passa o rato pelas trilhas: elas mexem-se 😄">
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />
      <div className="shell">
        <SectionHead
          label="// especialidades"
          title="Seis trilhas. Um só objetivo: pôr-te a construir."
          lead="Cada trilha é desenhada por engenheiros da Suez Inovações e termina com um projecto real no teu portfólio."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((t) => (
            <TrackCard key={t.slug} track={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function TunnelTeaser() {
  return (
    <section className="relative overflow-hidden border-y border-line bg-surface" data-bit="Lá dentro passas por 14 tecnologias. Vem ver!">
      <div className="shell grid items-center gap-12 py-24 lg:grid-cols-2">
        <div className="grid gap-6">
          <Scramble text="// o que vais aprender" className="t-label text-suez" />
          <h2 data-reveal className="t-h2">Entra no túnel e atravessa tudo o que vais aprender.</h2>
          <p data-reveal className="t-lead">
            Do primeiro <code className="t-mono text-str">git init</code> ao deploy na nuvem: uma viagem em 3D por 14 paragens, cada uma com
            o código e as ferramentas que vais dominar.
          </p>
          <div data-reveal>
            <Link href="/aprender" className="btn">
              <span className="t-mono">▶</span> Entrar no túnel <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <Link href="/aprender" aria-label="Entrar no túnel" className="rings group relative block aspect-square w-full max-w-[560px] justify-self-center">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="ring"
              style={{
                width: "70%",
                height: "70%",
                animationDelay: `${i * -0.6}s`,
                borderColor: ["var(--suez)", "var(--kw)", "var(--str)", "var(--fn)", "var(--num)"][i % 5],
              }}
            />
          ))}
          <span className="absolute inset-0 grid place-items-center">
            <Mark className="h-28 w-28 text-suez transition-transform duration-700 group-hover:scale-125 group-hover:rotate-45" />
          </span>
          {["git", "docker", "react", "ospf", "nmap", "scrum"].map((w, i) => (
            <span
              key={w}
              className="t-mono absolute rounded border border-line-strong bg-ground px-2 py-1 text-[0.75rem] text-ink-soft"
              style={{
                left: `${50 + Math.cos((i / 6) * Math.PI * 2) * 42}%`,
                top: `${50 + Math.sin((i / 6) * Math.PI * 2) * 42}%`,
                transform: "translate(-50%,-50%)",
              }}
            >
              {w}
            </span>
          ))}
        </Link>
      </div>
    </section>
  );
}

/** The method as a git log: the branch line draws itself as you scroll. */
export function Method() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(FULL, () => {
      const line = el.querySelector<HTMLElement>("[data-branch]");
      if (!line) return;
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: el.querySelector("[data-log]"), start: "top 70%", end: "bottom 60%", scrub: 0.6 },
        },
      );
      gsap.utils.toArray<HTMLElement>("[data-commit]", el).forEach((c) => {
        gsap.from(c, {
          opacity: 0.15,
          x: -20,
          duration: 0.6,
          ease: "expo.out",
          scrollTrigger: { trigger: c, start: "top 72%", toggleActions: "play none none reverse" },
        });
      });
      ScrollTrigger.refresh();
    }, el);
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="section" data-bit="O nosso método em 5 commits. Simples, né?">
      <div className="shell grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <SectionHead label="// git log --metodo" title="Aprender aqui é como trabalhar numa equipa de verdade." />
          <Window title="squad-alfa · sprint 03" className="hidden lg:block">
            <div className="grid grid-cols-3 gap-2 p-3">
              {["A fazer", "Em curso", "Feito"].map((c, ci) => (
                <div key={c} className="grid content-start gap-2 rounded bg-ground p-2">
                  <p className="t-label text-ink-faint">{c}</p>
                  {Array.from({ length: 3 - ci + (ci === 2 ? 2 : 0) }).map((_, k) => (
                    <span key={k} className="h-7 rounded border border-line-strong bg-surface-2" style={{ borderLeft: `3px solid ${["var(--num)", "var(--fn)", "var(--str)"][ci]}` }} />
                  ))}
                </div>
              ))}
            </div>
          </Window>
        </div>
        <ol data-log className="relative grid gap-12 pl-10 lg:col-span-6 lg:col-start-7">
          <span className="absolute bottom-2 left-[11px] top-2 w-px bg-line" />
          <span data-branch className="absolute bottom-2 left-[11px] top-2 w-px origin-top bg-suez shadow-[0_0_12px_var(--suez)]" />
          {method.map((m, i) => (
            <li key={m.hash} data-commit className="relative grid gap-2">
              <span className="absolute -left-10 top-1 grid h-6 w-6 place-items-center rounded-full border-2 border-suez bg-ground">
                <span className="h-2 w-2 rounded-full bg-suez" />
              </span>
              <p className="t-label text-ink-faint">
                <span className="text-num">{m.hash}</span> {i === method.length - 1 ? <span className="text-str">(HEAD → carreira)</span> : null}
              </p>
              <h3 className="t-h3">{m.title}</h3>
              <p className="text-ink-soft">{m.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function TemplatesPreview() {
  return (
    <section className="section border-t border-line" data-bit="Os templates são o teu ponto de partida. Clica num para o virar!">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead label="// templates" title="Não começas do zero. Começas com um template." />
          <Link href="/templates" className="btn btn-ghost mb-14 md:mb-20">
            Ver os {templates.length} templates <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.slice(0, 3).map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Cta() {
  return (
    <section className="relative isolate overflow-hidden border-t border-line" data-bit="Então, bora? 🚀">
      <div className="grid-bg absolute inset-0 -z-10" />
      <Mark className="absolute left-1/2 top-1/2 -z-10 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 text-suez opacity-[0.08]" />
      <div className="shell grid justify-items-center gap-8 py-32 text-center">
        <p className="t-label text-str">$ git commit -m &quot;comecei a minha carreira em tech&quot;</p>
        <h2 data-reveal className="t-h1 max-w-[16ch]">Pronto para o teu primeiro commit?</h2>
        <p data-reveal className="t-lead">Fala connosco e descobre quando abre a próxima turma da tua trilha.</p>
        <div data-reveal className="flex flex-wrap justify-center gap-3">
          <Link href="/contactos?inscricao=1" className="btn">
            Inscrever-me agora <span className="arrow" aria-hidden="true">→</span>
          </Link>
          <Link href="/formacoes" className="btn btn-ghost">
            Ver formações
          </Link>
        </div>
      </div>
    </section>
  );
}
