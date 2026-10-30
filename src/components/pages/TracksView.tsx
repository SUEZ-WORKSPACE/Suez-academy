"use client";

import Link from "next/link";
import { tracks } from "@/content/academy";
import { PageIntro, PageShell } from "@/components/site/PageShell";
import { TrackCard, toneVar } from "@/components/home/Sections";

export function TracksView() {
  return (
    <PageShell>
      <PageIntro
        label="// formacoes"
        title="Escolhe a tua trilha e começa a construir."
        lead="Seis especialidades práticas, desenhadas por quem trabalha todos os dias em software, cloud, redes e produto."
        bit="Todas as trilhas têm squads e um projecto final 💪"
      />
      <section className="shell grid gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {tracks.map((t) => (
          <TrackCard key={t.slug} track={t} />
        ))}
      </section>

      <section className="shell pb-[var(--section)]">
        <h2 data-reveal className="t-label mb-6 text-ink-faint">// comparar trilhas</h2>
        <div data-reveal className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[720px] text-left text-[0.9375rem]">
            <thead className="t-label bg-surface text-ink-faint">
              <tr>
                <th className="px-5 py-4 font-medium">trilha</th>
                <th className="px-5 py-4 font-medium">módulos</th>
                <th className="px-5 py-4 font-medium">stack</th>
                <th className="px-5 py-4 font-medium">projecto final</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((t) => (
                <tr key={t.slug} className="border-t border-line align-top transition-colors hover:bg-surface">
                  <td className="px-5 py-4">
                    <Link href={`/formacoes/${t.slug}`} className="font-semibold hover:underline" style={{ color: toneVar(t.tone) }}>
                      {t.code} · {t.title}
                    </Link>
                  </td>
                  <td className="t-mono px-5 py-4 tabular-nums text-ink-soft">{t.modules.length}</td>
                  <td className="px-5 py-4 text-ink-soft">{t.stack.slice(0, 4).join(", ")}</td>
                  <td className="px-5 py-4 text-ink-soft">{t.project}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}
