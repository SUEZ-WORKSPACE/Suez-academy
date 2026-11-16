# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Training-site for Suez Inovações (Angola). Sister of the institutional site at `../Suez-comunicacao-visual`, whose stack and config this repo mirrors. All user-facing copy is in Portuguese (Angola/European spelling: "acção", "contactos", "inscreve-te").

## Commands

```bash
npm run dev            # http://localhost:3000
npm run build          # production build; also the type check (no separate lint or test setup)
npm start              # serve the build
npx tsc --noEmit       # type check only
NEXT_DIST_DIR=.next-preview npm run build   # build into another dir while `next dev` uses .next
```

Do not run `next build` while `next start` is serving the same `.next`: it corrupts the output (`PageNotFoundError`). Stop the server, `rm -rf .next`, then build.

## Architecture

Next.js 15 App Router, React 18, TypeScript, Tailwind v4 (CSS-first, no tailwind.config), GSAP + ScrollTrigger, three.js. Fully static: no API routes, no backend. All pages prerender (`formacoes/[slug]` via `generateStaticParams`).

- **Content is data.** Every track, module, tunnel stop, template, contact and social link lives in `src/content/academy.ts`. Pages and components derive from it (`tracks`, `trackBySlug`, `stages`, `templates`, `method`, `contact`, `socials`, `nav`). Adding a track or template means editing that file, not the components. A track's `tone` names a colour token (`accent` = `--suez`, otherwise a syntax colour); `toneVar` in `components/home/Sections.tsx` maps it to a CSS var.
- **Routes are thin.** `src/app/*/page.tsx` export metadata and render a client view from `src/components/pages/*View.tsx` (home uses `components/home/HomeView.tsx`). `contactos` wraps its view in `Suspense` because it reads `?inscricao=1&formacao=<slug>` via `useSearchParams`.
- **Layout** (`src/app/layout.tsx`) loads Archivo and JetBrains Mono as `--font-archivo` / `--font-jetbrains` and mounts Header, Footer and the Bit mascot on every page.
- **Design tokens** are CSS custom properties at the top of `src/app/globals.css`, exposed to Tailwind through `@theme inline` (`bg-ground`, `text-ink-soft`, `border-line`, `text-suez`, `text-kw`…). Shared classes live there too (`.t-display`/`.t-h1..3`/`.t-label`, `.btn`, `.input`, `.win` code windows, `.tok-*` syntax colours, `.flip` cards, `.spot` pointer glow). Prefer these over ad-hoc styles.
- **Bit mascot** (`components/site/Bit.tsx`) listens for a `bit:say` window event. Trigger it with `say(text, mood)` from `lib/bit.ts`, or declaratively by adding `data-bit="…"` to a section (Bit comments when it scrolls into view).
- **Motion:** `lib/motion.ts` registers GSAP/ScrollTrigger and holds easing/duration tokens; `lib/useReveal.ts` animates `[data-reveal]` elements (content stays visible without JS; GSAP sets the hidden state). Every animated piece must respect `prefers-reduced-motion`.
- **3D scenes** (`components/home/HeroScene.tsx`, `components/tunnel/Tunnel.tsx`) create the three.js renderer imperatively in `useEffect` and dispose everything on cleanup; they pause off-screen via IntersectionObserver, render one still frame under reduced motion, and return early if WebGL is unavailable. The tunnel falls back to a plain `TunnelList` in that case. Tunnel panels are drawn on 2D canvas per `stage.kind` (`code`, `terminal`, `pipeline`, `network`, `kanban`, `chart`, `ui`, `shield`), using `tokenColor` from `lib/highlight.ts`.
- **three is untyped:** there is no `@types/three`; `src/types/three.d.ts` declares the module, and files use a local `type Obj3D = any` for three objects.
- **Logo:** `lib/rosette.ts` holds the rosette maths shared by the SVG mark (`components/site/Logo.tsx`) and the 3D hero. The logo is recreated in code; `public/logo.png` is the sister site's.
- **Enrolment** (`components/pages/ContactView.tsx`) validates client-side, then opens `wa.me` or `mailto:` with the message prefilled from `contact` in `academy.ts`.

## Content rules

Do not invent course prices, durations, dates, testimonials or certifications. These are not provided yet; the copy says "fala connosco" instead.
