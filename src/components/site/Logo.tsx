import { rosettePaths } from "@/lib/rosette";

const PATHS = rosettePaths(22, 90, 100);

/** The rosette mark, drawn flat in SVG so it stays crisp at any size. */
export function Mark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={0.7}>
      {PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/** Suez Academy lockup: mark, SUEZ in wide capitals, ACADEMY with its rule. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Suez Academy" role="img">
      <Mark className="h-10 w-10 text-suez transition-transform duration-700 group-hover:rotate-90" />
      <span className="grid leading-none" aria-hidden="true">
        <span className="text-[1.375rem] font-[800] tracking-[-0.01em]" style={{ fontVariationSettings: '"wdth" 125' }}>
          SUEZ
        </span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[0.5625rem] font-[700] tracking-[0.14em]" style={{ fontVariationSettings: '"wdth" 112' }}>
          ACADEMY <span className="h-px w-5 bg-current" />
        </span>
      </span>
    </span>
  );
}
