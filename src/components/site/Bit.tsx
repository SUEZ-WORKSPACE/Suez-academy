"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BIT_EVENT, type BitMood } from "@/lib/bit";

const GREETINGS: Record<string, string> = {
  "/": "Olá! Sou o Bit 👋 Escreve `help` no terminal ali em cima.",
  "/formacoes": "Seis trilhas. Qual é a tua? Eu gosto de todas 🤖",
  "/aprender": "Faz scroll para entrar no túnel. Aperta o cinto! 🚀",
  "/templates": "Clica num template para veres a estrutura de ficheiros.",
  "/contactos": "Deixa os teus dados. Respondemos rapidinho!",
};

const TIPS = [
  "Dica: `git commit -m \"wip\"` não é uma mensagem de commit 😅",
  "Fun fact: o primeiro bug foi uma traça de verdade, em 1947.",
  "Quem testa o código dorme melhor.",
  "Não há nuvem, há só o computador de outra pessoa ☁️",
  "Ctrl+C, Ctrl+V… cá aprendes a escrever o teu próprio código.",
  "Café é só a forma líquida do código ☕",
];

/**
 * Bit, the academy's mascot: a little screen-headed robot in the corner.
 * Its eyes follow the pointer, it blinks, and it comments on what is on screen:
 * sections carry a data-bit="…" line that it says as they scroll in, and any
 * component can make it talk through say() in lib/bit.
 */
export function Bit() {
  const path = usePathname();
  const [text, setText] = useState("");
  const [mood, setMood] = useState<BitMood>("wave");
  const [open, setOpen] = useState(true);
  const [hidden, setHidden] = useState(false);
  const eyes = useRef<SVGGElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const timer = useRef<number>(0);
  const tip = useRef(0);

  const talk = (t: string, m: BitMood = "idle", hold = 6500) => {
    setText(t);
    setMood(m);
    setOpen(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setOpen(false);
      setMood("idle");
    }, hold);
  };

  useEffect(() => {
    const base = "/" + (path.split("/")[1] ?? "");
    const greet = GREETINGS[base] ?? GREETINGS["/"];
    const id = window.setTimeout(() => talk(greet, "wave"), 900);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  useEffect(() => {
    const on = (e: Event) => {
      const { text: t, mood: m } = (e as CustomEvent<{ text: string; mood: BitMood }>).detail;
      talk(t, m);
    };
    window.addEventListener(BIT_EVENT, on);
    return () => window.removeEventListener(BIT_EVENT, on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Comment on sections as they come into view.
  useEffect(() => {
    const said = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !said.has(e.target)) {
            said.add(e.target);
            talk((e.target as HTMLElement).dataset.bit ?? "", "think");
          }
        }
      },
      { threshold: 0.45 },
    );
    const t = window.setTimeout(() => document.querySelectorAll("[data-bit]").forEach((el) => io.observe(el)), 1500);
    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  // Eyes follow the pointer.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: PointerEvent) => {
      const r = root.current?.getBoundingClientRect();
      if (!r || !eyes.current) return;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 3);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 400);
      eyes.current.style.transform = `translate(${(dx / d) * 4 * k}px, ${(dy / d) * 3 * k}px)`;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  if (hidden) {
    return (
      <button
        type="button"
        onClick={() => setHidden(false)}
        className="t-label fixed bottom-4 right-4 z-40 rounded border border-line-strong bg-surface px-3 py-2 text-ink-soft hover:text-suez"
      >
        chamar o Bit
      </button>
    );
  }

  return (
    <div ref={root} className="pointer-events-none fixed bottom-3 right-3 z-40 flex items-end gap-2 sm:bottom-5 sm:right-5">
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-auto relative mb-14 max-w-[240px] rounded-lg border border-line-strong bg-surface-2 px-4 py-3 text-[0.875rem] leading-snug shadow-[0_12px_32px_-12px_rgb(0_0_0/0.6)] transition-all duration-300 sm:max-w-[280px] ${
          open && text ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <span className="t-label mb-1 block text-suez">bit@academy:~$</span>
        {text.split(/(`[^`]+`)/).map((part, i) =>
          part.startsWith("`") ? (
            <code key={i} className="t-mono rounded bg-ground px-1 text-str">
              {part.slice(1, -1)}
            </code>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
        <button
          type="button"
          onClick={() => setHidden(true)}
          className="absolute right-1.5 top-1 text-ink-faint hover:text-ink"
          aria-label="Esconder o Bit"
        >
          ×
        </button>
        <span className="absolute -bottom-[7px] right-6 h-3 w-3 rotate-45 border-b border-r border-line-strong bg-surface-2" />
      </div>

      <button
        type="button"
        className={`bit pointer-events-auto relative h-[92px] w-[76px] shrink-0 sm:h-[112px] sm:w-[92px] bit-${mood}`}
        aria-label="Bit, o mascote. Clica para uma dica."
        onClick={() => {
          talk(TIPS[tip.current % TIPS.length], "party");
          tip.current++;
        }}
      >
        <svg viewBox="0 0 92 112" className="h-full w-full overflow-visible">
          {/* antenna */}
          <line x1="46" y1="14" x2="46" y2="4" stroke="var(--line-strong)" strokeWidth="2" />
          <circle cx="46" cy="4" r="3.5" className="bit-led" fill="var(--str)" />
          {/* arms */}
          <g className="bit-arm-l">
            <path d="M18 66 Q8 72 10 84" stroke="var(--suez)" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>
          <g className="bit-arm-r">
            <path d="M74 66 Q84 72 82 84" stroke="var(--suez)" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>
          {/* body */}
          <rect x="22" y="58" width="48" height="38" rx="9" fill="var(--navy)" stroke="var(--suez)" strokeWidth="2" />
          <text x="46" y="83" textAnchor="middle" fontSize="13" fontFamily="var(--font-mono)" fill="var(--suez)">
            {"</>"}
          </text>
          {/* legs */}
          <rect x="31" y="96" width="9" height="12" rx="3" fill="var(--line-strong)" />
          <rect x="52" y="96" width="9" height="12" rx="3" fill="var(--line-strong)" />
          {/* head = monitor */}
          <rect x="10" y="14" width="72" height="48" rx="10" fill="var(--surface)" stroke="var(--suez)" strokeWidth="2.5" />
          <rect x="17" y="21" width="58" height="34" rx="6" fill="#06101f" />
          <g ref={eyes} className="bit-eyes" style={{ transition: "transform 120ms" }}>
            <rect className="bit-eye" x="30" y="30" width="8" height="12" rx="4" fill="var(--suez)" />
            <rect className="bit-eye" x="54" y="30" width="8" height="12" rx="4" fill="var(--suez)" />
          </g>
          <path className="bit-mouth" d="M38 47 Q46 52 54 47" stroke="var(--str)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="24" cy="46" r="3" fill="var(--kw)" opacity="0.5" />
          <circle cx="68" cy="46" r="3" fill="var(--kw)" opacity="0.5" />
        </svg>
      </button>

      <style>{`
        .bit { animation: bit-float 3.2s ease-in-out infinite; }
        .bit-eye { transform-box: fill-box; transform-origin: center; animation: bit-blink 4.6s infinite; }
        .bit-led { animation: bit-led 1.6s steps(1) infinite; }
        .bit-arm-r { transform-box: fill-box; transform-origin: 0% 0%; }
        .bit-arm-l { transform-box: fill-box; transform-origin: 100% 0%; }
        .bit-wave .bit-arm-r { animation: bit-wave 0.5s ease-in-out 4 alternate; }
        .bit-party { animation: bit-hop 0.45s cubic-bezier(0.16,1,0.3,1) 2; }
        .bit-party .bit-arm-r { animation: bit-wave 0.3s ease-in-out 4 alternate; }
        .bit-party .bit-arm-l { animation: bit-wave-l 0.3s ease-in-out 4 alternate; }
        .bit-think .bit-eyes { transform: translate(3px,-3px) !important; }
        .bit:hover .bit-mouth { d: path("M36 46 Q46 56 56 46"); }
        @keyframes bit-float { 50% { transform: translateY(-6px); } }
        @keyframes bit-blink { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
        @keyframes bit-led { 50% { fill: var(--suez); } }
        @keyframes bit-wave { to { transform: rotate(-38deg); } }
        @keyframes bit-wave-l { to { transform: rotate(38deg); } }
        @keyframes bit-hop { 50% { transform: translateY(-16px) rotate(-4deg); } }
        @media (prefers-reduced-motion: reduce) {
          .bit, .bit-eye, .bit-led, .bit-arm-r, .bit-arm-l { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
