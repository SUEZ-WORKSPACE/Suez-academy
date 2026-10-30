"use client";

import Link from "next/link";
import { useState } from "react";
import { templates, tracks, type Track } from "@/content/academy";
import { Code, Window } from "@/components/site/Code";
import { PageIntro, PageShell } from "@/components/site/PageShell";
import { toneVar } from "@/components/home/Sections";
import { TemplateCard } from "@/components/templates/TemplateCard";

/** One track: the programme as a file explorer, outcomes, stack and final project. */
export function TrackView({ track }: { track: Track }) {
  const [open, setOpen] = useState(0);
  const mod = track.modules[open];
  const tone = toneVar(track.tone);
  const related = templates.filter((t) => t.track === track.slug);
  const i = tracks.findIndex((t) => t.slug === track.slug);
  const next = tracks[(i + 1) % tracks.length];

  return (
    <PageShell>
      <PageIntro label={`// trilha/${track.code}`} title={track.title} lead={track.description} bit={`Abre os módulos à esquerda para veres cada tema 📂`}>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/contactos?inscricao=1&formacao=${track.slug}`} className="btn">
            Inscrever-me nesta trilha <span className="arrow" aria-hidden="true">→</span>
          </Link>
          <Link href="/aprender" className="btn btn-ghost">
            <span className="t-mono text-suez">▶</span> Ver no túnel
          </Link>
        </div>
      </PageIntro>

      <section className="shell grid gap-6 pb-20 lg:grid-cols-12">
        <div data-reveal className="lg:col-span-8">
          <Window title={`~/${track.slug}/programa`}>
            <div className="grid md:grid-cols-[240px_1fr]">
              <ul className="t-mono border-b border-line p-3 text-[0.8125rem] md:border-b-0 md:border-r" role="tablist" aria-label="Módulos">
                <li className="px-2 pb-2 text-ink-faint">▾ modulos/</li>
                {track.modules.map((m, k) => (
                  <li key={m.title}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={k === open}
                      onClick={() => setOpen(k)}
                      className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left transition-colors ${
                        k === open ? "bg-surface-2 text-ink" : "text-ink-soft hover:text-ink"
                      }`}
                    >
                      <span style={{ color: k === open ? tone : undefined }}>{k === open ? "●" : "○"}</span>
                      {String(k + 1).padStart(2, "0")}-{m.title.toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/[̀-ͯ]/g, "")}.md
                    </button>
                  </li>
                ))}
              </ul>
              <div key={open} role="tabpanel" className="grid content-start gap-5 p-6 [animation:fade_400ms_ease-out]">
                <p className="t-label" style={{ color: tone }}>
                  módulo {String(open + 1).padStart(2, "0")} de {String(track.modules.length).padStart(2, "0")}
                </p>
                <h2 className="t-h2 !text-[clamp(1.75rem,3vw,2.5rem)]">{mod.title}</h2>
                <ul className="grid gap-3">
                  {mod.topics.map((t) => (
                    <li key={t} className="flex items-baseline gap-3 border-t border-line pt-3">
                      <span className="t-mono text-str">✔</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Window>
          <style>{`@keyframes fade { from { opacity: 0; transform: translateX(8px); } }`}</style>
        </div>

        <aside className="grid content-start gap-6 lg:col-span-4">
          <div data-reveal className="win">
            <div className="win-bar">
              <span className="t-label text-ink-soft">{track.file}</span>
            </div>
            <Code lines={track.snippet} className="p-4" />
          </div>
          <div data-reveal className="rounded-lg border border-line bg-surface p-6">
            <p className="t-label mb-4 text-ink-faint">// stack</p>
            <div className="flex flex-wrap gap-2">
              {track.stack.map((s) => (
                <span key={s} className="t-mono rounded border border-line-strong px-2.5 py-1 text-[0.8125rem]" style={{ color: tone }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="shell grid gap-12 py-20 md:grid-cols-2">
          <div data-reveal>
            <p className="t-label mb-5 text-ink-faint">// no fim vais conseguir</p>
            <ol className="grid gap-5">
              {track.outcomes.map((o, k) => (
                <li key={o} className="flex gap-4">
                  <span className="t-mono text-[1.5rem] leading-none" style={{ color: tone }}>
                    0{k + 1}
                  </span>
                  <span className="t-h3 !text-[1.25rem] !font-[600]">{o}</span>
                </li>
              ))}
            </ol>
          </div>
          <div data-reveal className="grid content-start gap-4 rounded-lg border p-7" style={{ borderColor: tone }}>
            <p className="t-label" style={{ color: tone }}>
              $ cat projecto-final.md
            </p>
            <p className="t-h3">{track.project}</p>
            <p className="text-ink-soft">Construído numa squad simulada, com sprints, code review e apresentação final.</p>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="shell py-20">
          <p data-reveal className="t-label mb-8 text-ink-faint">// templates desta trilha</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </section>
      ) : null}

      <Link
        href={`/formacoes/${next.slug}`}
        className="group block border-t border-line transition-colors hover:bg-surface"
      >
        <div className="shell flex items-center justify-between gap-6 py-14">
          <span className="grid gap-2">
            <span className="t-label text-ink-faint">próxima trilha →</span>
            <span className="t-h2" style={{ color: toneVar(next.tone) }}>
              {next.title}
            </span>
          </span>
          <span className="t-h1 transition-transform duration-300 group-hover:translate-x-3">→</span>
        </div>
      </Link>
    </PageShell>
  );
}
