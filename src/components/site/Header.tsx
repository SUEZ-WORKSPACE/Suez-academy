"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, socials } from "@/content/academy";
import { Logo } from "./Logo";
import { SocialIcon } from "./SocialIcon";

export function Header() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color] duration-300 ${
        scrolled || open ? "border-b border-line bg-ground/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="shell flex h-[72px] items-center justify-between gap-6">
        <Link href="/" className="group shrink-0" aria-label="Suez Academy, início">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active = path.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`t-mono rounded px-3 py-2 text-[0.8125rem] transition-colors ${
                  active ? "text-suez" : "text-ink-soft hover:text-ink"
                }`}
              >
                <span className="text-ink-faint">{active ? "▸ " : "./"}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/contactos?inscricao=1" className="btn hidden !py-2.5 sm:inline-flex">
            Inscreve-te <span className="arrow" aria-hidden="true">→</span>
          </Link>
          <button
            type="button"
            className="t-mono grid h-11 w-11 place-items-center rounded border border-line-strong lg:hidden"
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "×" : "≡"}
          </button>
        </div>
      </div>

      {open ? (
        <div id="menu" className="shell grid h-[calc(100dvh-72px)] content-start gap-1 overflow-y-auto pb-10 pt-6 lg:hidden">
          {[{ href: "/", label: "Início" }, ...nav].map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="t-h2 flex items-baseline gap-4 border-b border-line py-4"
              aria-current={path === item.href ? "page" : undefined}
            >
              <span className="t-label text-suez">0{i}</span>
              {item.label}
            </Link>
          ))}
          <Link href="/contactos?inscricao=1" className="btn mt-6 justify-center">
            Inscreve-te <span className="arrow" aria-hidden="true">→</span>
          </Link>
          <div className="mt-6 flex gap-2">
            {socials.map((s) => (
              <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="grid h-11 w-11 place-items-center rounded border border-line-strong text-ink-soft hover:text-suez">
                <SocialIcon id={s.id} />
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
