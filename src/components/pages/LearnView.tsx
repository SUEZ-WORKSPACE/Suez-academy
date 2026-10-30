"use client";

import Link from "next/link";
import { tracks } from "@/content/academy";
import { PageIntro, PageShell } from "@/components/site/PageShell";
import { Tunnel } from "@/components/tunnel/Tunnel";
import { toneVar } from "@/components/home/Sections";

export function LearnView() {
  return (
    <PageShell>
      <PageIntro
        label="// o que vais aprender connosco"
        title="Uma viagem por tudo o que vais aprender."
        lead="14 paragens, do primeiro commit ao portfólio. Faz scroll e atravessa o túnel: cada painel mostra o código e as ferramentas de uma parte da formação."
        bit="Aperta o cinto e faz scroll 🚀"
      />
      <Tunnel />
      <section className="shell py-[var(--section)]">
        <p data-reveal className="t-label mb-4 text-suez">// tree ./formacoes</p>
        <h2 data-reveal className="t-h2 mb-14 max-w-[20ch]">E aqui está tudo, organizado por trilha.</h2>
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {tracks.map((t) => (
            <div key={t.slug} data-reveal className="t-mono text-[0.875rem]">
              <Link href={`/formacoes/${t.slug}`} className="mb-3 block font-semibold hover:underline" style={{ color: toneVar(t.tone) }}>
                ▾ {t.slug}/
              </Link>
              <ul className="grid gap-1.5 border-l border-line pl-4 text-ink-soft">
                {t.modules.map((m) => (
                  <li key={m.title}>
                    <span className="text-ink">{m.title}</span>
                    <span className="block pl-3 text-[0.8125rem] text-ink-faint">└─ {m.topics.join(" · ")}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
