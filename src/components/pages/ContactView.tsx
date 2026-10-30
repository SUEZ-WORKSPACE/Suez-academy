"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { contact, socials, tracks } from "@/content/academy";
import { say } from "@/lib/bit";
import { PageIntro, PageShell } from "@/components/site/PageShell";
import { SocialIcon } from "@/components/site/SocialIcon";
import { Window } from "@/components/site/Code";

type Key = "nome" | "email" | "telefone" | "formacao" | "modalidade" | "nivel" | "mensagem";
type Errors = Partial<Record<Key, string>>;

const MODES = ["Presencial", "Online", "Tanto faz"];
const LEVELS = ["Iniciante", "Já programo um pouco", "Intermédio / profissional"];
const OTHER = "Ainda não sei, quero orientação";

/**
 * Contact and enrolment. There is no backend: the form validates, then opens
 * WhatsApp (wa.me) or the mail client with the message already written.
 * A live code window mirrors what the visitor types, as a JSON object.
 */
export function ContactView() {
  const params = useSearchParams();
  const preset = tracks.find((t) => t.slug === params.get("formacao"));
  const enrol = params.get("inscricao") === "1" || Boolean(preset);

  const [v, setV] = useState<Record<Key, string>>({
    nome: "",
    email: "",
    telefone: "",
    formacao: preset?.title ?? (enrol ? tracks[0].title : OTHER),
    modalidade: MODES[0],
    nivel: LEVELS[0],
    mensagem: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (k: Key) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setV((x) => ({ ...x, [k]: e.target.value }));
    setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (!v.nome.trim()) next.nome = "Diz-nos o teu nome.";
    if (!v.email.trim() && !v.telefone.trim()) next.email = "Deixa um email ou um telefone.";
    else if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) next.email = "Este email não parece válido.";
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      document.getElementById(`f-${first}`)?.focus();
      say("Ups, falta preencher um campo 👀", "think");
      return false;
    }
    return true;
  };

  const message = () =>
    [
      "Olá, Suez Academy!",
      "",
      enrol ? "Quero inscrever-me numa formação." : "Gostaria de mais informações.",
      "",
      `Nome: ${v.nome.trim()}`,
      v.email.trim() ? `Email: ${v.email.trim()}` : "",
      v.telefone.trim() ? `Telefone: ${v.telefone.trim()}` : "",
      `Formação: ${v.formacao}`,
      `Modalidade: ${v.modalidade}`,
      `Nível: ${v.nivel}`,
      v.mensagem.trim() ? `\n${v.mensagem.trim()}` : "",
    ]
      .filter((l, i, a) => l !== "" || a[i - 1] !== "")
      .join("\n");

  const send = (channel: "whatsapp" | "email") => {
    if (!validate()) return;
    const body = encodeURIComponent(message());
    const url =
      channel === "whatsapp"
        ? `${contact.whatsapp}?text=${body}`
        : `mailto:${contact.email}?subject=${encodeURIComponent(`Suez Academy · ${v.formacao} · ${v.nome.trim()}`)}&body=${body}`;
    window.open(url, channel === "whatsapp" ? "_blank" : "_self", "noopener");
    setSent(true);
    say("Mensagem pronta! Falamos em breve 🎉", "party");
  };

  const err = (k: Key) =>
    errors[k] ? (
      <p id={`f-${k}-err`} className="t-mono text-[0.8125rem] text-rec">
        ✖ {errors[k]}
      </p>
    ) : null;

  const input = (k: Key, label: string, type = "text", autoComplete?: string) => (
    <div className="field">
      <label htmlFor={`f-${k}`}>{label}</label>
      <input
        id={`f-${k}`}
        type={type}
        className="input"
        autoComplete={autoComplete}
        value={v[k]}
        onChange={set(k)}
        aria-invalid={errors[k] ? true : undefined}
        aria-describedby={errors[k] ? `f-${k}-err` : undefined}
      />
      {err(k)}
    </div>
  );

  const select = (k: Key, label: string, options: string[]) => (
    <div className="field">
      <label htmlFor={`f-${k}`}>{label}</label>
      <select id={`f-${k}`} className="input" value={v[k]} onChange={set(k)}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );

  const json = (k: Key) => (v[k].trim() ? `"${v[k].trim().replace(/"/g, '\\"').slice(0, 40)}"` : "null");

  return (
    <PageShell>
      <PageIntro
        label={enrol ? "// inscricao" : "// contactos"}
        title={enrol ? "Faz a tua inscrição. Nós tratamos do resto." : "Fala connosco."}
        lead="Preenche o formulário e escolhe como enviar: WhatsApp ou email. A mensagem vai já escrita, só tens de carregar em enviar."
        bit="Preenche e eu vejo o JSON a ser escrito ao lado 👉"
      />

      <section className="shell grid gap-12 pb-20 lg:grid-cols-12">
        <form
          noValidate
          className="grid content-start gap-5 lg:col-span-7"
          onSubmit={(e) => {
            e.preventDefault();
            send("whatsapp");
          }}
          data-reveal
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {input("nome", "nome *", "text", "name")}
            {input("telefone", "telefone", "tel", "tel")}
          </div>
          {input("email", "email", "email", "email")}
          {select("formacao", "formação de interesse", [...tracks.map((t) => t.title), OTHER])}
          <div className="grid gap-5 sm:grid-cols-2">
            {select("modalidade", "modalidade", MODES)}
            {select("nivel", "o teu nível", LEVELS)}
          </div>
          <div className="field">
            <label htmlFor="f-mensagem">mensagem (opcional)</label>
            <textarea id="f-mensagem" className="input" value={v.mensagem} onChange={set("mensagem")} placeholder="Conta-nos o que queres aprender, a tua experiência, horários…" />
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn max-sm:w-full max-sm:justify-center">
              <SocialIcon id="whatsapp" /> Enviar por WhatsApp <span className="arrow" aria-hidden="true">→</span>
            </button>
            <button type="button" className="btn btn-ghost max-sm:w-full max-sm:justify-center" onClick={() => send("email")}>
              Enviar por email
            </button>
          </div>
          <p role="status" className="t-mono text-[0.875rem] text-str">
            {sent ? "✔ Abrimos a tua aplicação com a mensagem pronta. Se não abriu, usa os contactos ao lado." : ""}
          </p>
        </form>

        <aside className="grid content-start gap-6 lg:col-span-5">
          <Window title="inscricao.json">
            <pre className="t-mono overflow-x-auto p-5 text-[0.8125rem] leading-[1.8]" aria-hidden="true">
              <span className="tok-kw">const</span> inscricao <span className="tok-pun">=</span> <span className="tok-pun">{"{"}</span>
              {"\n"}
              {(["nome", "email", "telefone", "formacao", "modalidade", "nivel"] as Key[]).map((k) => (
                <span key={k} className="block">
                  {"  "}
                  <span className="tok-fn">{k}</span>
                  <span className="tok-pun">: </span>
                  <span className={json(k) === "null" ? "tok-kw" : "tok-str"}>{json(k)}</span>
                  <span className="tok-pun">,</span>
                </span>
              ))}
              <span className="tok-pun">{"};"}</span>
              {"\n\n"}
              <span className="tok-cm">{"// "}{sent ? "enviado ✔" : "à espera do teu envio…"}</span>
            </pre>
          </Window>

          <dl data-reveal className="grid rounded-lg border border-line bg-surface">
            {[
              ["telefone / whatsapp", <a key="p" href={contact.phoneHref} className="link tabular-nums">{contact.phone}</a>],
              ["email", <a key="e" href={`mailto:${contact.email}`} className="link">{contact.email}</a>],
              ["morada", contact.address.map((l) => <span key={l} className="block">{l}</span>)],
            ].map(([dt, dd], k) => (
              <div key={k} className={`grid gap-1 px-6 py-5 ${k ? "border-t border-line" : ""}`}>
                <dt className="t-label text-ink-faint">{dt}</dt>
                <dd>{dd}</dd>
              </div>
            ))}
            <div className="flex gap-2 border-t border-line px-6 py-5">
              {socials.map((s) => (
                <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="grid h-10 w-10 place-items-center rounded border border-line-strong text-ink-soft transition-colors hover:border-suez hover:bg-suez hover:text-on-suez">
                  <SocialIcon id={s.id} />
                </a>
              ))}
            </div>
          </dl>
        </aside>
      </section>

      <div data-reveal className="border-t border-line">
        <iframe
          src={contact.mapEmbed}
          title="Mapa: Edifício Kwanza Sul, Belas Business Park, Luanda"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[420px] w-full border-0 [filter:invert(0.9)_hue-rotate(180deg)_saturate(0.6)]"
        />
      </div>
    </PageShell>
  );
}
