"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { tracks } from "@/content/academy";
import { say } from "@/lib/bit";

type Line = { kind: "in" | "out" | "ok" | "err" | "dim"; text: string };

const INTRO: Line[] = [
  { kind: "in", text: "npx suez-academy init" },
  { kind: "dim", text: "› a preparar o teu ambiente…" },
  { kind: "ok", text: "✔ 6 trilhas encontradas" },
  { kind: "ok", text: "✔ squad pronta · mentores online" },
  { kind: "out", text: "Escreve help para ver os comandos." },
];

/**
 * The hero terminal: it types its intro by itself, then the visitor can use it.
 * `help`, `ls`, `cd <trilha>`, `cat <trilha>`, `inscrever`, `tunel`, `whoami`, `clear`.
 */
export function Terminal() {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState("");
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const body = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setLines(INTRO);
      setReady(true);
      return;
    }
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      await wait(700);
      for (const line of INTRO) {
        if (cancelled) return;
        if (line.kind === "in") {
          for (let i = 1; i <= line.text.length; i++) {
            if (cancelled) return;
            setTyping(line.text.slice(0, i));
            await wait(45 + Math.random() * 40);
          }
          await wait(250);
          setTyping("");
        } else {
          await wait(380);
        }
        setLines((l) => [...l, line]);
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight });
  }, [lines, typing]);

  const slugs = tracks.map((t) => t.slug);
  const find = (arg: string) => tracks.find((t) => t.slug === arg || t.slug.startsWith(arg) || t.code === arg);

  const run = (raw: string) => {
    const cmd = raw.trim();
    const [name, ...args] = cmd.split(/\s+/);
    const arg = args.join(" ").toLowerCase();
    const out: Line[] = [{ kind: "in", text: cmd }];
    switch (name.toLowerCase()) {
      case "":
        break;
      case "help":
        out.push(
          { kind: "out", text: "ls              lista as trilhas" },
          { kind: "out", text: "cat <trilha>    resumo de uma trilha" },
          { kind: "out", text: "cd <trilha>     abre a página da trilha" },
          { kind: "out", text: "tunel           entra no túnel do que vais aprender" },
          { kind: "out", text: "templates       vê os templates" },
          { kind: "out", text: "inscrever       faz a tua inscrição" },
          { kind: "out", text: "whoami · clear · sudo" },
        );
        break;
      case "ls":
        tracks.forEach((t) => out.push({ kind: "out", text: `${t.code}  ${t.slug}/` }));
        break;
      case "cat": {
        const t = find(arg);
        if (!t) out.push({ kind: "err", text: `cat: ${arg || "?"}: trilha não encontrada (tenta ls)` });
        else out.push({ kind: "ok", text: t.title }, { kind: "out", text: t.short }, { kind: "dim", text: `stack: ${t.stack.slice(0, 5).join(", ")}` });
        break;
      }
      case "cd": {
        const t = find(arg);
        if (!t) out.push({ kind: "err", text: `cd: ${arg || "?"}: escolhe uma de: ${slugs.slice(0, 2).join(", ")}…` });
        else {
          out.push({ kind: "ok", text: `→ a abrir /formacoes/${t.slug}` });
          setTimeout(() => router.push(`/formacoes/${t.slug}`), 500);
        }
        break;
      }
      case "tunel":
      case "túnel":
        out.push({ kind: "ok", text: "→ aperta o cinto…" });
        setTimeout(() => router.push("/aprender"), 500);
        break;
      case "templates":
        out.push({ kind: "ok", text: "→ a abrir /templates" });
        setTimeout(() => router.push("/templates"), 500);
        break;
      case "inscrever":
      case "inscrição":
      case "inscricao":
        out.push({ kind: "ok", text: "→ bora! a abrir o formulário" });
        say("Boa escolha! Preenche e falamos contigo 🎉", "party");
        setTimeout(() => router.push("/contactos?inscricao=1"), 600);
        break;
      case "whoami":
        out.push({ kind: "out", text: "futuro-dev 🚀 (ainda sem inscrição… escreve inscrever)" });
        break;
      case "sudo":
        out.push({ kind: "err", text: "permissão negada: primeiro tens de te inscrever 😉" });
        say("Ahah, aqui não há sudo sem inscrição!", "party");
        break;
      case "clear":
        setLines([]);
        return;
      default:
        out.push({ kind: "err", text: `${name}: comando não encontrado. Escreve help.` });
    }
    setLines((l) => [...l, ...out]);
  };

  const color: Record<Line["kind"], string> = {
    in: "text-ink",
    out: "text-ink-soft",
    ok: "text-str",
    err: "text-rec",
    dim: "text-ink-faint",
  };

  return (
    <div className="win shadow-[0_30px_80px_-30px_rgb(77_155_255/0.45)]" onClick={() => input.current?.focus()}>
      <div className="win-bar">
        <span className="win-dot" />
        <span className="win-dot" />
        <span className="win-dot" />
        <span className="t-label ml-2 text-ink-soft">aluno@suez-academy: ~</span>
        <span className="t-label ml-auto text-ink-faint">zsh</span>
      </div>
      <div ref={body} className="t-mono h-[230px] overflow-y-auto p-4 text-[0.8125rem] leading-[1.7] sm:h-[260px]" aria-live="polite">
        {lines.map((l, i) => (
          <p key={i} className={`whitespace-pre-wrap ${color[l.kind]}`}>
            {l.kind === "in" ? <span className="text-suez">➜ ~ </span> : null}
            {l.text}
          </p>
        ))}
        {!ready ? (
          <p>
            <span className="text-suez">➜ ~ </span>
            <span className="caret">{typing}</span>
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (value.trim()) setHistory((h) => [value, ...h]);
              run(value);
              setValue("");
              setHIndex(-1);
            }}
            className="flex"
          >
            <label htmlFor="term" className="text-suez">
              ➜ ~&nbsp;
            </label>
            <input
              id="term"
              ref={input}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" && history.length) {
                  e.preventDefault();
                  const i = Math.min(history.length - 1, hIndex + 1);
                  setHIndex(i);
                  setValue(history[i]);
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  const i = Math.max(-1, hIndex - 1);
                  setHIndex(i);
                  setValue(i < 0 ? "" : history[i]);
                } else if (e.key === "Tab") {
                  const [n, a = ""] = value.split(" ");
                  const match = slugs.find((s) => a && s.startsWith(a));
                  if (match) {
                    e.preventDefault();
                    setValue(`${n} ${match}`);
                  }
                }
              }}
              autoComplete="off"
              spellCheck={false}
              aria-label="Comando do terminal"
              placeholder="help"
              className="min-w-0 flex-1 bg-transparent text-ink caret-suez outline-none placeholder:text-ink-faint"
            />
          </form>
        )}
      </div>
    </div>
  );
}
