"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { trackBySlug, type Template, type TemplateKind } from "@/content/academy";
import { useTilt } from "@/lib/useTilt";

const bar = (w: string, c = "var(--line-strong)", h = 6) => (
  <span className="block rounded-sm" style={{ width: w, height: h, background: c }} />
);

/** A tiny drawn preview of each template, in CSS only. */
function Mock({ kind }: { kind: TemplateKind }) {
  switch (kind) {
    case "landing":
      return (
        <div className="grid h-full content-start gap-3 p-4">
          <div className="flex items-center justify-between">{bar("22%", "var(--suez)")}<span className="flex gap-1.5">{bar("18px")}{bar("18px")}{bar("18px")}</span></div>
          <div className="mt-3 grid gap-2">{bar("78%", "var(--ink)", 12)}{bar("56%", "var(--ink)", 12)}{bar("64%")}</div>
          <span className="mt-1 h-6 w-20 rounded-sm bg-suez" />
          <div className="mt-2 grid grid-cols-3 gap-2">{[0, 1, 2].map((i) => <span key={i} className="h-12 rounded-sm border border-line-strong bg-surface-2" />)}</div>
        </div>
      );
    case "dashboard":
      return (
        <div className="grid h-full grid-cols-[22%_1fr] gap-2 p-3">
          <div className="grid content-start gap-2 rounded-sm bg-surface-2 p-2">{[0, 1, 2, 3, 4].map((i) => <span key={i}>{bar(i === 1 ? "90%" : "70%", i === 1 ? "var(--suez)" : undefined, 5)}</span>)}</div>
          <div className="grid content-start gap-2">
            <div className="grid grid-cols-3 gap-2">{["var(--fn)", "var(--str)", "var(--num)"].map((c) => <span key={c} className="grid gap-1 rounded-sm bg-surface-2 p-2">{bar("50%")}{bar("70%", c, 8)}</span>)}</div>
            <div className="flex h-20 items-end gap-1.5 rounded-sm bg-surface-2 p-2">{[40, 65, 30, 80, 55, 92, 70, 48].map((h, i) => <span key={i} className="flex-1 rounded-t-sm bg-suez/80 transition-[height] duration-500 group-hover:[height:calc(var(--h)*1%)]" style={{ height: `${h * 0.7}%`, ["--h" as string]: h }} />)}</div>
          </div>
        </div>
      );
    case "mobile":
      return (
        <div className="grid h-full place-items-center">
          <div className="grid h-[150px] w-[80px] content-start gap-2 rounded-[14px] border-2 border-line-strong bg-ground p-2 transition-transform duration-500 group-hover:-rotate-6">
            <span className="mx-auto h-1 w-6 rounded-full bg-line-strong" />
            <span className="grid gap-1 rounded-md bg-suez p-1.5">{bar("40%", "var(--on-suez)", 3)}{bar("70%", "var(--on-suez)", 7)}</span>
            <div className="grid grid-cols-3 gap-1">{[0, 1, 2].map((i) => <span key={i} className="h-5 rounded bg-surface-2" />)}</div>
            {[0, 1, 2].map((i) => <span key={i} className="flex justify-between">{bar("45%", undefined, 4)}{bar("20%", i ? "var(--rec)" : "var(--str)", 4)}</span>)}
          </div>
        </div>
      );
    case "shop":
      return (
        <div className="grid h-full grid-cols-3 content-start gap-2 p-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="grid gap-1 rounded-sm bg-surface-2 p-1.5">
              <span className="h-10 rounded-sm" style={{ background: ["var(--fn)", "var(--kw)", "var(--num)", "var(--str)", "var(--type)", "var(--suez)"][i], opacity: 0.55 }} />
              {bar("80%", undefined, 4)}
              {bar("40%", "var(--str)", 4)}
            </span>
          ))}
        </div>
      );
    case "api":
    case "pipeline":
    case "terraform":
      return <MockCode kind={kind} />;
    case "topology":
      return (
        <svg viewBox="0 0 200 130" className="h-full w-full p-3" aria-hidden="true">
          {[[100, 22, 50, 70], [100, 22, 150, 70], [50, 70, 25, 112], [50, 70, 75, 112], [150, 70, 125, 112], [150, 70, 175, 112]].map(([a, b, c, d], i) => (
            <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="var(--line-strong)" strokeWidth="1.5" strokeDasharray="4 3" className="[animation:dash_1.2s_linear_infinite]" />
          ))}
          {[[100, 22, "R1", "var(--num)"], [50, 70, "SW1", "var(--fn)"], [150, 70, "SW2", "var(--fn)"], [25, 112, "PC", "var(--ink-soft)"], [75, 112, "SRV", "var(--str)"], [125, 112, "PC", "var(--ink-soft)"], [175, 112, "AP", "var(--kw)"]].map(([x, y, l, c], i) => (
            <g key={i}>
              <rect x={(x as number) - 15} y={(y as number) - 9} width="30" height="18" rx="3" fill="var(--surface-2)" stroke={c as string} />
              <text x={x} y={(y as number) + 3.5} textAnchor="middle" fontSize="9" fill={c as string} fontFamily="var(--font-mono)">{l}</text>
            </g>
          ))}
          <style>{`@keyframes dash { to { stroke-dashoffset: -14; } }`}</style>
        </svg>
      );
    case "kanban":
      return (
        <div className="grid h-full grid-cols-3 gap-2 p-3">
          {["var(--num)", "var(--fn)", "var(--str)"].map((c, ci) => (
            <div key={c} className="grid content-start gap-1.5 rounded-sm bg-surface-2 p-1.5">
              {bar("50%", c, 4)}
              {Array.from({ length: 3 - ci + (ci === 2 ? 1 : 0) }).map((_, k) => (
                <span key={k} className="h-6 rounded-sm border border-line-strong bg-ground transition-transform duration-300 group-hover:translate-x-1" style={{ transitionDelay: `${k * 60}ms` }} />
              ))}
            </div>
          ))}
        </div>
      );
    case "canvas":
      return (
        <div className="grid h-full grid-cols-4 grid-rows-2 gap-1.5 p-3">
          {[["Problema", "col-span-1 row-span-2", "var(--rec)"], ["Utilizador", "col-span-2", "var(--fn)"], ["Valor", "row-span-2", "var(--str)"], ["Métricas", "col-span-2", "var(--type)"]].map(([l, cls, c]) => (
            <span key={l} className={`t-mono grid content-start gap-1 rounded-sm border border-line-strong bg-surface-2 p-1.5 text-[9px] ${cls}`} style={{ color: c }}>
              {l}
              {bar("70%", undefined, 3)}
              {bar("50%", undefined, 3)}
            </span>
          ))}
        </div>
      );
    case "audit":
      return (
        <div className="t-mono grid h-full content-start gap-1.5 p-4 text-[10px]">
          {[["CRÍTICO", "var(--rec)", "SQL injection /login"], ["ALTO", "var(--num)", "TLS 1.0 activo"], ["MÉDIO", "var(--type)", "headers em falta"], ["OK", "var(--str)", "firewall configurada"]].map(([s, c, t]) => (
            <span key={s} className="flex items-center gap-2 rounded-sm bg-surface-2 px-2 py-1.5">
              <span className="rounded-sm px-1 text-[8px] text-on-suez" style={{ background: c }}>{s}</span>
              <span className="text-ink-soft">{t}</span>
            </span>
          ))}
        </div>
      );
  }
}

const CODE: Record<string, string[]> = {
  api: ["@Post('inscricoes')", "async criar(@Body() dto) {", "  return this.svc.criar(dto);", "}", "", "✔ 42 testes passaram"],
  pipeline: ["name: ci", "on: [push]", "jobs:", "  build:   ✔ 38s", "  test:    ✔ 1m12s", "  deploy:  ● a correr"],
  terraform: ["module \"rede\" {", "  source = \"./modules/network\"", "  cidr   = \"10.0.0.0/16\"", "}", "", "Plan: 12 to add, 0 to destroy"],
};

function MockCode({ kind }: { kind: string }) {
  return (
    <div className="t-mono grid h-full content-start p-4 text-[10.5px] leading-[1.7]">
      {CODE[kind].map((l, i) => (
        <span key={i} className={`whitespace-pre ${l.includes("✔") ? "text-str" : l.includes("●") ? "text-num" : i === 0 ? "text-kw" : "text-ink-soft"}`}>
          {l || " "}
        </span>
      ))}
    </div>
  );
}

/** A template card that flips in 3D to show its file tree. */
export function TemplateCard({ template }: { template: Template }) {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref, 5);
  const track = trackBySlug(template.track);

  return (
    <div ref={ref} data-reveal className="flip group h-[400px]" data-flipped={flipped}>
      <div className="flip-inner">
        <button
          type="button"
          onClick={() => setFlipped(true)}
          aria-label={`${template.name}: ver estrutura de ficheiros`}
          className="flip-face spot grid h-full w-full grid-rows-[1fr_auto] overflow-hidden rounded-lg border border-line bg-surface text-left transition-colors hover:border-suez"
        >
          <div className="relative m-3 mb-0 overflow-hidden rounded-t-md border border-b-0 border-line bg-ground">
            <div className="flex items-center gap-1.5 border-b border-line px-2.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
              <span className="t-label ml-2 truncate text-[10px] text-ink-faint">{template.id}</span>
            </div>
            <div className="h-[calc(100%-26px)] transition-transform duration-700 group-hover:scale-[1.04]">
              <Mock kind={template.kind} />
            </div>
          </div>
          <div className="grid gap-2 border-t border-line p-5">
            <p className="t-label text-ink-faint">{track?.title.split(/[:&]/)[0].trim()}</p>
            <h3 className="t-h3 !text-[1.25rem]">{template.name}</h3>
            <p className="text-[0.875rem] text-ink-soft">{template.description}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {template.stack.map((s) => (
                <span key={s} className="t-label rounded-sm border border-line-strong px-1.5 py-0.5 text-ink-soft">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </button>

        <div className="flip-face flip-back grid grid-rows-[auto_1fr_auto] overflow-hidden rounded-lg border border-suez bg-surface">
          <div className="win-bar">
            <span className="t-label text-suez">~/{template.id}</span>
            <button type="button" onClick={() => setFlipped(false)} className="t-label ml-auto text-ink-soft hover:text-ink" aria-label="Voltar">
              ↺ voltar
            </button>
          </div>
          <ul className="t-mono grid content-start gap-0.5 p-5 text-[0.8125rem]" aria-label="Estrutura de ficheiros">
            {template.tree.map((f, i) => {
              const dir = f.trim().endsWith("/");
              return (
                <li key={i} className={`whitespace-pre ${dir ? "text-fn" : "text-ink-soft"}`}>
                  <span className="text-ink-faint">{f.startsWith("    ") ? "│   └─ " : f.startsWith("  ") ? "├─ " : ""}</span>
                  {dir ? "▸ " : ""}
                  {f.trim()}
                </li>
              );
            })}
          </ul>
          <div className="grid gap-2 border-t border-line p-4">
            <p className="t-mono text-[0.75rem] text-ink-faint">
              <span className="text-str">$</span> git clone academy/{template.id}
            </p>
            <Link href={`/contactos?inscricao=1&formacao=${template.track}`} className="btn justify-center !py-2.5">
              Quero usar este template <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
