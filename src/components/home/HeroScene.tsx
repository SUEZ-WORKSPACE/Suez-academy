"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// three is untyped here (no @types/three), so its objects are typed loosely.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Obj3D = any;
import { rosettePoints } from "@/lib/rosette";

const GLYPHS = [
  "{ }", "</>", "=>", "()", "[ ]", ";", "&&", "λ", "$_", "git", "npm", "0x1F", "async", "SELECT", "ssh",
  "docker", "null", "++", "!=", "#!", "fn", "ip", "OSPF", "yaml", "C#", ".NET", "TS", "<div>", "200 OK", "sudo",
];
const TONES = ["#4d9bff", "#82aaff", "#c792ea", "#7ee7a8", "#ffb86b", "#ffd866", "#e8eef6"];

/**
 * The hero's 3D world: the Suez rosette turning in the middle of a stream of
 * code glyphs flying toward the camera, over a moving grid floor.
 * Leans toward the pointer, speeds up with scroll, pauses off screen,
 * and renders one still frame under reduced motion.
 */
export function HeroScene({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: Obj3D;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // No WebGL: the page still reads perfectly.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050a14, 6, 34);
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 80);
    camera.position.set(0, 0.2, 7);

    // Rosette
    const pos: number[] = [];
    for (const curve of rosettePoints(48, 240)) {
      for (let i = 1; i < curve.length; i++) pos.push(...curve[i - 1], ...curve[i]);
    }
    const rGeo = new THREE.BufferGeometry();
    rGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    const rMat = new THREE.LineBasicMaterial({ color: 0x4d9bff, transparent: true, opacity: 0, fog: false });
    const rosette = new THREE.LineSegments(rGeo, rMat);
    const rosetteGroup = new THREE.Group();
    rosetteGroup.add(rosette);
    scene.add(rosetteGroup);

    // A faint second rosette, larger and slower, for depth.
    const halo = new THREE.LineSegments(rGeo, new THREE.LineBasicMaterial({ color: 0xc792ea, transparent: true, opacity: 0.12, fog: false }));
    halo.scale.setScalar(1.6);
    rosetteGroup.add(halo);

    // Grid floor
    const grid = new THREE.GridHelper(80, 60, 0x2a3d5e, 0x172540);
    grid.position.y = -2.6;
    (grid.material as Obj3D).transparent = true;
    (grid.material as Obj3D).opacity = 0.55;
    scene.add(grid);
    const cell = 80 / 60;

    // Glyph sprites
    const font = getComputedStyle(document.body).getPropertyValue("--font-jetbrains").trim() || "monospace";
    const textures: Obj3D[] = [];
    const makeTexture = (txt: string) => {
      const c = document.createElement("canvas");
      c.width = 256;
      c.height = 96;
      const ctx = c.getContext("2d")!;
      ctx.font = `500 52px ${font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      ctx.fillText(txt, 128, 50);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      textures.push(tex);
      return tex;
    };

    const isSmall = window.innerWidth < 768;
    const COUNT = reduced ? 40 : isSmall ? 45 : 90;
    const sprites: { s: Obj3D; speed: number }[] = [];
    const glyphTex = new Map<string, Obj3D>();
    const build = () => {
      for (let i = 0; i < COUNT; i++) {
        const g = GLYPHS[i % GLYPHS.length];
        if (!glyphTex.has(g)) glyphTex.set(g, makeTexture(g));
        const mat = new THREE.SpriteMaterial({
          map: glyphTex.get(g),
          color: TONES[i % TONES.length],
          transparent: true,
          opacity: 0.85,
          depthWrite: false,
        });
        const s = new THREE.Sprite(mat);
        const scale = 0.5 + Math.random() * 0.6;
        s.scale.set(scale * 2.66, scale, 1);
        s.position.set((Math.random() - 0.5) * 22, (Math.random() - 0.4) * 9, -Math.random() * 32);
        scene.add(s);
        sprites.push({ s, speed: 1 + Math.random() * 2.2 });
      }
    };

    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const wide = width >= 1024;
      rosetteGroup.position.set(wide ? 2.6 : 0, wide ? 0.1 : 0.9, 0);
      rosetteGroup.scale.setScalar(wide ? 1.35 : 1);
      renderer.render(scene, camera);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const pointer = { x: 0, y: 0 };
    const lean = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    let scrollBoost = 0;
    let lastY = window.scrollY;
    const onScroll = () => {
      scrollBoost = Math.min(6, scrollBoost + Math.abs(window.scrollY - lastY) * 0.02);
      lastY = window.scrollY;
    };

    let raf = 0;
    let visible = true;
    let last = performance.now();
    const born = last;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const age = Math.min(1, (now - born) / 1400);
      rMat.opacity = 0.9 * (1 - Math.pow(1 - age, 4));
      scrollBoost *= 0.94;
      const speed = 1 + scrollBoost;

      rosette.rotation.z += dt * 0.18 * speed;
      rosette.rotation.y += dt * 0.07 * speed;
      halo.rotation.z -= dt * 0.05;
      halo.rotation.x += dt * 0.03;
      lean.x += (pointer.y * 0.3 - lean.x) * 0.05;
      lean.y += (pointer.x * 0.45 - lean.y) * 0.05;
      rosetteGroup.rotation.x = 0.35 + lean.x;
      rosetteGroup.rotation.y = lean.y;
      camera.position.x = pointer.x * 0.6;
      camera.position.y = 0.2 - pointer.y * 0.3;
      camera.lookAt(0, 0, -4);

      grid.position.z = (grid.position.z + dt * 2.4 * speed) % cell;
      for (const p of sprites) {
        p.s.position.z += dt * p.speed * speed;
        if (p.s.position.z > 2.5) {
          p.s.position.z = -30;
          p.s.position.x = (Math.random() - 0.5) * 22;
          p.s.position.y = (Math.random() - 0.4) * 9;
        }
        const m = p.s.material as Obj3D;
        // Fade in from the fog, fade out before a glyph gets big enough to cover the copy.
        const z = p.s.position.z;
        m.opacity = Math.max(0, Math.min(0.55, (z + 30) / 10, (2.5 - z) / 4)) * age;
      }

      renderer.render(scene, camera);
      raf = visible ? requestAnimationFrame(tick) : 0;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf && !reduced) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });

    let disposed = false;
    document.fonts.ready.then(() => {
      if (disposed) return;
      build();
      resize();
      if (reduced) {
        rMat.opacity = 0.85;
        renderer.render(scene, camera);
        return;
      }
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      io.observe(el);
      raf = requestAnimationFrame(tick);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      rGeo.dispose();
      rMat.dispose();
      textures.forEach((t) => t.dispose());
      sprites.forEach((p) => (p.s.material as Obj3D).dispose());
      grid.geometry.dispose();
      (grid.material as Obj3D).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} className={className} />;
}
