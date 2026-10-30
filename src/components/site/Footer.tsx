import Link from "next/link";
import { contact, nav, sisterSites, socials, tracks } from "@/content/academy";
import { Logo, Mark } from "./Logo";
import { SocialIcon } from "./SocialIcon";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-surface">
      <Mark className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] text-suez opacity-[0.07]" />
      <div className="shell relative grid gap-12 py-16 md:grid-cols-12">
        <div className="grid content-start gap-5 md:col-span-4">
          <Logo />
          <p className="max-w-[36ch] text-ink-soft">
            A escola prática da Suez Inovações. Formação em tecnologia com quem desenvolve sistemas reais em Angola.
          </p>
          <div className="flex gap-2">
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded border border-line-strong text-ink-soft transition-colors hover:border-suez hover:bg-suez hover:text-on-suez"
              >
                <SocialIcon id={s.id} />
              </a>
            ))}
          </div>
        </div>

        <div className="grid content-start gap-3 md:col-span-3">
          <p className="t-label text-ink-faint">// formações</p>
          {tracks.map((t) => (
            <Link key={t.slug} href={`/formacoes/${t.slug}`} className="link w-fit text-[0.9375rem] text-ink-soft">
              {t.title.split(":")[0]}
            </Link>
          ))}
        </div>

        <div className="grid content-start gap-3 md:col-span-2">
          <p className="t-label text-ink-faint">// navegar</p>
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="link w-fit text-[0.9375rem] text-ink-soft">
              {n.label}
            </Link>
          ))}
          {sisterSites.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="link w-fit text-[0.9375rem] text-ink-soft">
              {s.label} ↗
            </a>
          ))}
        </div>

        <div className="grid content-start gap-3 md:col-span-3">
          <p className="t-label text-ink-faint">// contacto</p>
          <a href={contact.phoneHref} className="link w-fit tabular-nums">{contact.phone}</a>
          <a href={`mailto:${contact.email}`} className="link w-fit">{contact.email}</a>
          <address className="not-italic text-ink-soft">
            {contact.address.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </address>
        </div>
      </div>
      <div className="shell t-label relative flex flex-wrap justify-between gap-3 border-t border-line py-6 text-ink-faint">
        <span>© {new Date().getFullYear()} Suez Academy · Suez Inovações</span>
        <span>
          <span className="text-str">●</span> build passing · feito em Luanda
        </span>
      </div>
    </footer>
  );
}
