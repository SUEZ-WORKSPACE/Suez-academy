"use client";

import { useState } from "react";
import { templates, tracks } from "@/content/academy";
import { PageIntro, PageShell } from "@/components/site/PageShell";
import { TemplateCard } from "@/components/templates/TemplateCard";

export function TemplatesView() {
  const [filter, setFilter] = useState("todos");
  const shown = filter === "todos" ? templates : templates.filter((t) => t.track === filter);
  const options = [{ slug: "todos", label: "todos" }, ...tracks.filter((t) => templates.some((x) => x.track === t.slug)).map((t) => ({ slug: t.slug, label: t.slug }))];

  return (
    <PageShell>
      <PageIntro
        label="// templates"
        title="Templates prontos para começares a construir."
        lead="Projectos de partida que usamos nas aulas: forkas, estudas a estrutura e transformas no teu próprio projecto. Clica num cartão para ver os ficheiros."
        bit="Clica num cartão para o virar 🔄"
      />
      <section className="shell pb-[var(--section)]">
        <div className="no-scrollbar -mx-[var(--gutter)] mb-10 flex gap-2 overflow-x-auto px-[var(--gutter)]" role="toolbar" aria-label="Filtrar por trilha">
          {options.map((o) => (
            <button
              key={o.slug}
              type="button"
              aria-pressed={filter === o.slug}
              onClick={() => setFilter(o.slug)}
              className={`t-mono shrink-0 rounded border px-3 py-2 text-[0.8125rem] transition-colors ${
                filter === o.slug ? "border-suez bg-suez text-on-suez" : "border-line-strong text-ink-soft hover:text-ink"
              }`}
            >
              {o.label === "todos" ? "*" : `${o.label}/`}
            </button>
          ))}
          <span className="t-label ml-auto shrink-0 self-center pl-4 text-ink-faint">{shown.length} resultados</span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((t) => (
            <TemplateCard key={`${filter}-${t.id}`} template={t} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
