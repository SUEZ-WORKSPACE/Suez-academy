import { highlight } from "@/lib/highlight";

/** Lines of code with syntax colours and optional line numbers. */
export function Code({ lines, numbers = true, className = "" }: { lines: string[]; numbers?: boolean; className?: string }) {
  return (
    <pre className={`t-mono overflow-x-auto text-[0.8125rem] leading-[1.75] ${className}`}>
      <code>
        {lines.map((line, i) => (
          <span key={i} className="block whitespace-pre">
            {numbers ? <span className="mr-4 inline-block w-4 select-none text-right text-ink-faint">{i + 1}</span> : null}
            {highlight(line).map((tok, j) => (
              <span key={j} className={tok.cls}>
                {tok.text}
              </span>
            ))}
          </span>
        ))}
      </code>
    </pre>
  );
}

export function Window({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`win ${className}`}>
      <div className="win-bar">
        <span className="win-dot" />
        <span className="win-dot" />
        <span className="win-dot" />
        <span className="t-label ml-2 text-ink-soft">{title}</span>
      </div>
      {children}
    </div>
  );
}
