import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell grid min-h-[80svh] content-center gap-6 pt-28">
      <p className="t-mono text-rec">Error 404: rota não encontrada</p>
      <h1 className="t-display">
        4<span className="text-suez">0</span>4
      </h1>
      <pre className="t-mono text-[0.875rem] text-ink-soft">
        <span className="text-str">$</span> cd esta-pagina{"\n"}cd: no such file or directory
      </pre>
      <div>
        <Link href="/" className="btn">
          cd ~ <span className="arrow">→</span>
        </Link>
      </div>
    </section>
  );
}
