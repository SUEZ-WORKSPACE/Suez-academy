"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// three is untyped here (no @types/three), so its objects are typed loosely.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Obj3D = any;
import { stages, trackBySlug, type Stage } from "@/content/academy";
import { say } from "@/lib/bit";
import { highlight, tokenColor } from "@/lib/highlight";
import { Code, Window } from "@/components/site/Code";

const SPACING = 16;
const RADIUS = 5.2;
const TONES: Record<string, string> = {
  "engenharia-de-software": "#82aaff",
  "devops-e-cloud": "#7ee7a8",
  "redes-e-infraestrutura": "#ffb86b",
  "ciberseguranca-pratica": "#c792ea",
  "product-management": "#ffd866",
  "carreira-e-soft-skills": "#4d9bff",
};
const toneOf = (s: Stage) => TONES[s.track] ?? "#4d9bff";

/**
 * /aprender: a 3D tunnel the visitor flies through with the scroll.
 * Each stop is a panel showing one thing they will learn, drawn on a canvas
 * texture (code, terminal, pipeline, network, kanban, chart, UI). Scrolling
 * fast widens the field of view like a warp. Under reduced motion, or without
 * WebGL, the same stops are shown as a plain list.
 */
export function Tunnel() {
  const wrap = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<"3d" | "list" | "pending">("pending");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = host.current;
    const box = wrap.current;
    if (reduced || !el || !box) {
      setMode("list");
      return;
    }
    let renderer: Obj3D;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    } catch {
      setMode("list");
      return;
    }
    setMode("3d");

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050a14, 1);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.setAttribute("aria-hidden", "true");
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050a14, 0.045);
    const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 140);
    camera.position.set(0, 0, 8);

    const n = stages.length;
    const length = (n + 1) * SPACING;
    const disposables: { dispose: () => void }[] = [];

    // Rings: one every 2 units, coloured by the stage they belong to.
    const tunnel = new THREE.Group();
    scene.add(tunnel);
    const ringGeo = new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 7 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(a) * RADIUS, Math.sin(a) * RADIUS, 0);
      }),
    );
    disposables.push(ringGeo);
    const ringMats = new Map<string, Obj3D>();
    for (let z = 4; z > -length - 20; z -= 2) {
      const stage = stages[Math.min(n - 1, Math.max(0, Math.floor(-z / SPACING)))];
      const tone = toneOf(stage);
      if (!ringMats.has(tone)) {
        const m = new THREE.LineBasicMaterial({ color: tone, transparent: true, opacity: 0.55 });
        ringMats.set(tone, m);
        disposables.push(m);
      }
      const ring = new THREE.Line(ringGeo, ringMats.get(tone));
      ring.position.z = z;
      ring.rotation.z = (z / 2) * 0.06;
      tunnel.add(ring);
    }

    // Long rails along the hexagon corners.
    const railPts: number[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      railPts.push(Math.cos(a) * RADIUS, Math.sin(a) * RADIUS, 6, Math.cos(a) * RADIUS, Math.sin(a) * RADIUS, -length - 20);
    }
    const railGeo = new THREE.BufferGeometry();
    railGeo.setAttribute("position", new THREE.Float32BufferAttribute(railPts, 3));
    const railMat = new THREE.LineBasicMaterial({ color: 0x2a3d5e, transparent: true, opacity: 0.8 });
    tunnel.add(new THREE.LineSegments(railGeo, railMat));
    disposables.push(railGeo, railMat);

    // Data particles streaming inside the tunnel.
    const P = window.innerWidth < 768 ? 900 : 2200;
    const pPos = new Float32Array(P * 3);
    for (let i = 0; i < P; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = RADIUS * (0.55 + Math.random() * 0.42);
      pPos[i * 3] = Math.cos(a) * r;
      pPos[i * 3 + 1] = Math.sin(a) * r;
      pPos[i * 3 + 2] = 6 - Math.random() * (length + 26);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x4d9bff, size: 0.05, transparent: true, opacity: 0.9 });
    scene.add(new THREE.Points(pGeo, pMat));
    disposables.push(pGeo, pMat);

    // Panels
    const panels: Obj3D[] = [];
    const mono = getComputedStyle(document.body).getPropertyValue("--font-jetbrains").trim() || "monospace";
    const sans = getComputedStyle(document.body).getPropertyValue("--font-archivo").trim() || "sans-serif";
    const panelGeo = new THREE.PlaneGeometry(6.4, 4);
    disposables.push(panelGeo);

    const buildPanels = () => {
      stages.forEach((stage, i) => {
        const canvas = document.createElement("canvas");
        canvas.width = 1280;
        canvas.height = 800;
        drawPanel(canvas.getContext("2d")!, stage, i, mono, sans);
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
        disposables.push(tex, mat);
        const mesh = new THREE.Mesh(panelGeo, mat);
        mesh.userData.side = i % 2 === 0 ? -1 : 1;
        mesh.position.z = -(i + 1) * SPACING;
        scene.add(mesh);
        panels.push(mesh);
      });
    };

    // Glowing gate at the end.
    const gateGeo = new THREE.RingGeometry(1.6, 1.75, 6);
    const gateMat = new THREE.MeshBasicMaterial({ color: 0x4d9bff, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
    const gate = new THREE.Mesh(gateGeo, gateMat);
    gate.position.z = -length - 6;
    scene.add(gate);
    disposables.push(gateGeo, gateMat);

    let narrow = false;
    const layout = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      narrow = width < 900;
      panels.forEach((p) => {
        const side = p.userData.side as number;
        p.position.x = narrow ? 0 : side * 2.1;
        p.position.y = narrow ? 0.5 : 0.25;
        p.rotation.y = narrow ? 0 : -side * 0.32;
        p.scale.setScalar(narrow ? Math.min(1, width / 520) * 0.85 : 1);
      });
    };
    const ro = new ResizeObserver(layout);
    ro.observe(el);

    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const readProgress = () => {
      const r = box.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      return total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    };

    let camZ = 8;
    let lastZ = camZ;
    let fov = 62;
    let raf = 0;
    let visible = true;
    let current = -1;
    let shown = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const p = readProgress();
      const target = 8 - p * (length + 2);
      camZ += (target - camZ) * Math.min(1, dt * 5);
      const vel = Math.abs(camZ - lastZ) / Math.max(dt, 0.001);
      lastZ = camZ;

      camera.position.z = camZ;
      camera.position.x += (pointer.x * 0.7 - camera.position.x) * 0.05;
      camera.position.y += (-pointer.y * 0.45 - camera.position.y) * 0.05;
      camera.lookAt(camera.position.x * 0.4, camera.position.y * 0.4, camZ - 10);
      fov += (62 + Math.min(28, vel * 0.9) - fov) * 0.1;
      camera.fov = fov;
      camera.updateProjectionMatrix();

      tunnel.rotation.z += dt * 0.05 + vel * 0.0006;
      gate.rotation.z -= dt * 0.6;

      // Panels lean in and brighten as the camera approaches.
      panels.forEach((m, i) => {
        const d = camZ - m.position.z;
        const near = 1 - Math.min(1, Math.abs(d - 7) / 12);
        (m.material as Obj3D).opacity = d < 0.5 ? Math.max(0, d * 2) : 0.25 + near * 0.75;
        m.position.y = (narrow ? 0.5 : 0.25) + Math.sin(now / 900 + i) * 0.06;
      });

      const idx = Math.min(n - 1, Math.max(0, Math.round((8 - camZ) / SPACING - 0.6)));
      if (idx !== current) {
        current = idx;
        setActive(idx);
      }
      const pr = Math.round(p * 100);
      if (pr !== shown) {
        shown = pr;
        setProgress(p);
      }

      renderer.render(scene, camera);
      raf = visible ? requestAnimationFrame(tick) : 0;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });

    let disposed = false;
    document.fonts.ready.then(() => {
      if (disposed) return;
      buildPanels();
      layout();
      io.observe(el);
      raf = requestAnimationFrame(tick);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  // Bit narrates every stop.
  const spoken = useRef(-1);
  useEffect(() => {
    if (mode !== "3d" || active === spoken.current) return;
    spoken.current = active;
    if (progress < 0.01 && active === 0) return;
    const s = stages[active];
    say(`Paragem ${String(active + 1).padStart(2, "0")}: ${s.title}.`, "think");
  }, [active, mode, progress]);

  if (mode === "list") return <TunnelList />;

  const stage = stages[active];
  const track = trackBySlug(stage.track);
  const done = progress > 0.985;

  return (
    <div ref={wrap} style={{ height: `${(stages.length + 1) * 90}vh` }} className="relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div ref={host} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--ground)_95%)]" />

        {/* progress rail */}
        <ol className="absolute left-[var(--gutter)] top-1/2 hidden -translate-y-1/2 gap-2.5 xl:grid" aria-label="Paragens do túnel">
          {stages.map((s, i) => (
            <li key={s.id} className={`t-label flex items-center gap-3 transition-colors duration-300 ${i === active ? "text-ink" : i < active ? "text-ink-faint" : "text-ink-faint/50"}`}>
              <span
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: i === active ? 28 : 10, background: i <= active ? toneOf(s) : "var(--line-strong)" }}
              />
              {s.title}
            </li>
          ))}
        </ol>

        {/* top bar */}
        <div className="shell absolute inset-x-0 top-[88px] flex items-center justify-between">
          <p className="t-label text-ink-soft">
            <span className="text-suez">~/tunel</span> · paragem {String(active + 1).padStart(2, "0")}/{stages.length}
          </p>
          <p className="t-label tabular-nums text-ink-faint">{Math.round(progress * 100)}%</p>
        </div>
        <div className="absolute inset-x-0 top-[72px] h-[2px] bg-line">
          <div className="h-full origin-left bg-suez shadow-[0_0_12px_var(--suez)]" style={{ transform: `scaleX(${progress})` }} />
        </div>

        {/* caption */}
        <div className="shell pointer-events-none absolute inset-x-0 bottom-6 sm:bottom-10" aria-live="polite">
          <div
            key={stage.id}
            className="tunnel-caption pointer-events-auto max-w-[560px] rounded-lg border bg-ground/80 p-5 backdrop-blur-md"
            style={{ borderColor: toneOf(stage) }}
          >
            <p className="t-label mb-2" style={{ color: toneOf(stage) }}>
              {stage.label} · {track?.title.split(/[:&]/)[0].trim()}
            </p>
            <h2 className="t-h3">{stage.title}</h2>
            <p className="mt-2 text-[0.9375rem] text-ink-soft">{stage.text}</p>
            <Link href={`/formacoes/${stage.track}`} className="t-mono mt-3 inline-block text-[0.8125rem] text-suez hover:underline">
              cd /formacoes/{stage.track} →
            </Link>
          </div>
        </div>

        {done ? (
          <div className="absolute inset-0 grid place-items-center bg-ground/70 backdrop-blur-sm">
            <div className="tunnel-caption grid justify-items-center gap-5 px-6 text-center">
              <p className="t-label text-str">✔ 14/14 paragens concluídas</p>
              <p className="t-h1 max-w-[14ch]">Saíste do túnel. Agora é contigo.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/contactos?inscricao=1" className="btn">
                  Inscrever-me <span className="arrow" aria-hidden="true">→</span>
                </Link>
                <button type="button" className="btn btn-ghost" onClick={() => window.scrollTo({ top: wrap.current!.offsetTop, behavior: "smooth" })}>
                  ↺ Repetir a viagem
                </button>
              </div>
            </div>
          </div>
        ) : progress < 0.02 ? (
          <p className="t-label absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded border border-line-strong bg-ground/70 px-4 py-2 text-ink-soft">
            faz scroll para avançar ↓
          </p>
        ) : null}
      </div>
      <style>{`
        .tunnel-caption { animation: cap-in 600ms cubic-bezier(0.16,1,0.3,1); }
        @keyframes cap-in { from { opacity: 0; transform: translateY(16px); } }
      `}</style>
    </div>
  );
}

/** The same journey, without 3D. */
function TunnelList() {
  return (
    <div className="shell grid gap-5 pb-24 sm:grid-cols-2">
      {stages.map((s, i) => (
        <Window key={s.id} title={`${String(i + 1).padStart(2, "0")} · ${s.label}`}>
          <div className="grid gap-3 p-5">
            <h2 className="t-h3">{s.title}</h2>
            <p className="text-ink-soft">{s.text}</p>
            <Code lines={s.lines} numbers={false} />
          </div>
        </Window>
      ))}
    </div>
  );
}

/* ---------- canvas drawing ---------- */

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function drawPanel(ctx: CanvasRenderingContext2D, s: Stage, i: number, mono: string, sans: string) {
  const W = 1280;
  const H = 800;
  const tone = toneOf(s);
  ctx.clearRect(0, 0, W, H);

  // body
  ctx.save();
  ctx.shadowColor = tone;
  ctx.shadowBlur = 40;
  roundRect(ctx, 24, 24, W - 48, H - 48, 28);
  ctx.fillStyle = "rgba(10,20,36,0.94)";
  ctx.fill();
  ctx.restore();
  ctx.lineWidth = 3;
  ctx.strokeStyle = tone;
  roundRect(ctx, 24, 24, W - 48, H - 48, 28);
  ctx.stroke();

  // title bar
  ctx.fillStyle = "rgba(15,29,51,0.9)";
  ctx.beginPath();
  ctx.roundRect(26, 26, W - 52, 70, [26, 26, 0, 0]);
  ctx.fill();
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, k) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(70 + k * 34, 61, 10, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.font = `500 24px ${mono}`;
  ctx.fillStyle = "#93a3b8";
  ctx.textBaseline = "middle";
  ctx.fillText(`${s.label} · ${s.track}`, 190, 62);

  // heading
  ctx.fillStyle = tone;
  ctx.font = `600 28px ${mono}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(`// ${String(i + 1).padStart(2, "0")}`, 72, 160);
  ctx.fillStyle = "#e8eef6";
  ctx.font = `800 64px ${sans}`;
  wrapText(ctx, s.title, 72, 236, W - 144, 70, 2);

  const area = { x: 72, y: 330, w: W - 144, h: 400 };
  switch (s.kind) {
    case "code":
    case "terminal":
    case "shield":
      drawCode(ctx, s, area, mono, tone);
      break;
    case "pipeline":
      drawPipeline(ctx, s.lines, area, mono, tone);
      break;
    case "network":
      drawNetwork(ctx, s.lines, area, mono, tone);
      break;
    case "kanban":
      drawKanban(ctx, s.lines, area, mono);
      break;
    case "chart":
      drawChart(ctx, s, area, mono, tone);
      break;
    case "ui":
      drawUi(ctx, s, area, mono, sans, tone);
      break;
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, max: number, lh: number, maxLines: number) {
  const words = text.split(" ");
  let line = "";
  let lines = 0;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > max && line) {
      ctx.fillText(line, x, y + lines * lh);
      lines++;
      line = w;
      if (lines >= maxLines) return;
    } else line = test;
  }
  ctx.fillText(line, x, y + lines * lh);
}

type Area = { x: number; y: number; w: number; h: number };

function drawCode(ctx: CanvasRenderingContext2D, s: Stage, a: Area, mono: string, tone: string) {
  ctx.fillStyle = "#050a14";
  roundRect(ctx, a.x, a.y, a.w, a.h, 16);
  ctx.fill();
  ctx.font = `400 30px ${mono}`;
  ctx.textBaseline = "alphabetic";
  const lh = Math.min(52, (a.h - 40) / Math.max(4, s.lines.length));
  s.lines.forEach((line, k) => {
    const y = a.y + 56 + k * lh;
    ctx.fillStyle = "#5c6b82";
    ctx.fillText(String(k + 1), a.x + 28, y);
    let x = a.x + 80;
    for (const t of highlight(line)) {
      ctx.fillStyle = tokenColor[t.cls] ?? "#e8eef6";
      ctx.fillText(t.text, x, y);
      x += ctx.measureText(t.text).width;
    }
  });
  if (s.kind === "shield") {
    // shield badge on the right
    const cx = a.x + a.w - 120;
    const cy = a.y + a.h / 2;
    ctx.strokeStyle = tone;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 90);
    ctx.lineTo(cx + 75, cy - 60);
    ctx.quadraticCurveTo(cx + 70, cy + 50, cx, cy + 95);
    ctx.quadraticCurveTo(cx - 70, cy + 50, cx - 75, cy - 60);
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle = "#7ee7a8";
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy);
    ctx.lineTo(cx - 5, cy + 25);
    ctx.lineTo(cx + 35, cy - 25);
    ctx.stroke();
  }
}

function drawPipeline(ctx: CanvasRenderingContext2D, steps: string[], a: Area, mono: string, tone: string) {
  const gap = 40;
  const w = (a.w - gap * (steps.length - 1)) / steps.length;
  const y = a.y + 80;
  steps.forEach((st, k) => {
    const x = a.x + k * (w + gap);
    const doneStep = k < steps.length - 1;
    ctx.fillStyle = "#0f1d33";
    roundRect(ctx, x, y, w, 200, 18);
    ctx.fill();
    ctx.strokeStyle = doneStep ? "#7ee7a8" : tone;
    ctx.lineWidth = 3;
    roundRect(ctx, x, y, w, 200, 18);
    ctx.stroke();
    ctx.fillStyle = doneStep ? "#7ee7a8" : tone;
    ctx.font = `600 56px ${mono}`;
    ctx.textAlign = "center";
    ctx.fillText(doneStep ? "✔" : "●", x + w / 2, y + 95);
    ctx.fillStyle = "#e8eef6";
    ctx.font = `500 32px ${mono}`;
    ctx.fillText(st, x + w / 2, y + 160);
    ctx.textAlign = "left";
    if (k < steps.length - 1) {
      ctx.strokeStyle = "#2a3d5e";
      ctx.beginPath();
      ctx.moveTo(x + w + 6, y + 100);
      ctx.lineTo(x + w + gap - 6, y + 100);
      ctx.stroke();
    }
  });
  ctx.fillStyle = "#93a3b8";
  ctx.font = `400 26px ${mono}`;
  ctx.fillText("on: push → main   ·   tempo total 2m41s", a.x, a.y + 360);
}

function drawNetwork(ctx: CanvasRenderingContext2D, nodes: string[], a: Area, mono: string, tone: string) {
  const pos = [
    [0.5, 0.12],
    [0.25, 0.5],
    [0.75, 0.5],
    [0.1, 0.9],
    [0.4, 0.9],
    [0.9, 0.9],
  ].map(([px, py]) => [a.x + px * a.w, a.y + py * a.h]);
  const links = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [1, 2]];
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 10]);
  ctx.strokeStyle = "#2a3d5e";
  links.forEach(([p, q]) => {
    ctx.beginPath();
    ctx.moveTo(pos[p][0], pos[p][1]);
    ctx.lineTo(pos[q][0], pos[q][1]);
    ctx.stroke();
  });
  ctx.setLineDash([]);
  nodes.forEach((label, k) => {
    const [x, y] = pos[k];
    ctx.fillStyle = "#0f1d33";
    roundRect(ctx, x - 80, y - 38, 160, 76, 14);
    ctx.fill();
    ctx.strokeStyle = k === 0 ? tone : "#82aaff";
    roundRect(ctx, x - 80, y - 38, 160, 76, 14);
    ctx.stroke();
    ctx.fillStyle = "#e8eef6";
    ctx.font = `600 30px ${mono}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  });
  ctx.fillStyle = "#93a3b8";
  ctx.font = `400 24px ${mono}`;
  ctx.fillText("VLAN 10 · VLAN 20 · OSPF área 0", a.x + a.w * 0.55, a.y + 30);
}

function drawKanban(ctx: CanvasRenderingContext2D, cols: string[], a: Area, mono: string) {
  const gap = 24;
  const w = (a.w - gap * (cols.length - 1)) / cols.length;
  const colors = ["#ffb86b", "#82aaff", "#c792ea", "#7ee7a8"];
  cols.forEach((c, k) => {
    const x = a.x + k * (w + gap);
    ctx.fillStyle = "#0f1d33";
    roundRect(ctx, x, a.y, w, a.h, 16);
    ctx.fill();
    ctx.fillStyle = colors[k];
    ctx.font = `600 26px ${mono}`;
    ctx.fillText(c, x + 22, a.y + 46);
    const cards = [3, 2, 1, 4][k];
    for (let j = 0; j < cards; j++) {
      const y = a.y + 76 + j * 76;
      ctx.fillStyle = "#050a14";
      roundRect(ctx, x + 18, y, w - 36, 60, 10);
      ctx.fill();
      ctx.fillStyle = colors[k];
      ctx.fillRect(x + 18, y, 6, 60);
      ctx.fillStyle = "#2a3d5e";
      ctx.fillRect(x + 40, y + 20, (w - 90) * (0.5 + ((j * 37 + k * 13) % 40) / 100), 8);
      ctx.fillRect(x + 40, y + 36, (w - 90) * 0.35, 8);
    }
  });
}

function drawChart(ctx: CanvasRenderingContext2D, s: Stage, a: Area, mono: string, tone: string) {
  const half = a.w * 0.48;
  drawCode(ctx, { ...s, lines: s.lines }, { x: a.x, y: a.y, w: half, h: a.h }, mono, tone);
  const data = [62, 44, 80, 36, 55, 70];
  const labels = ["dev", "ops", "rede", "sec", "prod", "agile"];
  const bx = a.x + half + 50;
  const bw = (a.w - half - 50) / data.length;
  data.forEach((v, k) => {
    const h = (v / 100) * (a.h - 70);
    ctx.fillStyle = ["#82aaff", "#7ee7a8", "#ffb86b", "#c792ea", "#ffd866", "#4d9bff"][k];
    roundRect(ctx, bx + k * bw + 10, a.y + a.h - 50 - h, bw - 20, h, 8);
    ctx.fill();
    ctx.fillStyle = "#93a3b8";
    ctx.font = `400 22px ${mono}`;
    ctx.textAlign = "center";
    ctx.fillText(labels[k], bx + k * bw + bw / 2, a.y + a.h - 12);
    ctx.textAlign = "left";
  });
}

function drawUi(ctx: CanvasRenderingContext2D, s: Stage, a: Area, mono: string, sans: string, tone: string) {
  if (s.id === "web") {
    const half = a.w * 0.5;
    drawCode(ctx, s, { x: a.x, y: a.y, w: half - 20, h: a.h }, mono, tone);
    const x = a.x + half + 20;
    ctx.fillStyle = "#0f1d33";
    roundRect(ctx, x, a.y, half - 20, a.h, 16);
    ctx.fill();
    ctx.fillStyle = "#e8eef6";
    ctx.font = `800 40px ${sans}`;
    ctx.fillText("Suez Academy", x + 40, a.y + 80);
    ctx.fillStyle = "#2a3d5e";
    ctx.fillRect(x + 40, a.y + 112, half - 140, 12);
    ctx.fillRect(x + 40, a.y + 140, half - 220, 12);
    ctx.save();
    ctx.shadowColor = "#4d9bff";
    ctx.shadowBlur = 30;
    ctx.fillStyle = "#4d9bff";
    roundRect(ctx, x + 40, a.y + 200, 280, 80, 10);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#04101f";
    ctx.font = `700 32px ${sans}`;
    ctx.fillText("Inscreve-te →", x + 70, a.y + 252);
    return;
  }
  // product: four steps as chips connected by a line
  const w = (a.w - 60) / s.lines.length;
  ctx.strokeStyle = "#2a3d5e";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(a.x + w / 2, a.y + 150);
  ctx.lineTo(a.x + a.w - w / 2, a.y + 150);
  ctx.stroke();
  s.lines.forEach((l, k) => {
    const cx = a.x + 30 + k * w + w / 2 - 30;
    ctx.fillStyle = "#0f1d33";
    ctx.beginPath();
    ctx.arc(cx, a.y + 150, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = k === s.lines.length - 1 ? "#7ee7a8" : tone;
    ctx.stroke();
    ctx.fillStyle = tone;
    ctx.font = `700 40px ${mono}`;
    ctx.textAlign = "center";
    ctx.fillText(String(k + 1), cx, a.y + 165);
    ctx.fillStyle = "#e8eef6";
    ctx.font = `600 30px ${sans}`;
    ctx.fillText(l, cx, a.y + 290);
    ctx.textAlign = "left";
  });
}
