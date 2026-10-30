/**
 * The wireframe rosette of the Suez logo: closed four-lobed curves, each twisted
 * a little further. Same maths as the institutional site, shared by the 3D hero
 * and the flat SVG mark in the header.
 */
export function rosettePoints(curves = 44, steps = 220): [number, number, number][][] {
  const out: [number, number, number][][] = [];
  for (let c = 0; c < curves; c++) {
    const phase = (c / curves) * Math.PI;
    const tilt = Math.sin(phase) * 0.9;
    const spin = phase * 0.25;
    const curve: [number, number, number][] = [];
    for (let s = 0; s <= steps; s++) {
      const t = (s / steps) * Math.PI * 2;
      const lobe = Math.pow(Math.abs(Math.cos(2 * t)), 0.7);
      const r = 0.35 + 1.25 * lobe;
      let x = r * Math.cos(t);
      let y = r * Math.sin(t);
      let z = Math.sin(2 * t + phase) * 0.55 * lobe;
      // rotate around X by tilt
      const y1 = y * Math.cos(tilt) - z * Math.sin(tilt);
      const z1 = y * Math.sin(tilt) + z * Math.cos(tilt);
      y = y1;
      z = z1;
      // rotate around Z by spin
      const x2 = x * Math.cos(spin) - y * Math.sin(spin);
      const y2 = x * Math.sin(spin) + y * Math.cos(spin);
      x = x2;
      y = y2;
      curve.push([x, y, z]);
    }
    out.push(curve);
  }
  return out;
}

/** Flat SVG paths of the rosette, seen from a fixed angle, rounded so server and client agree. */
export function rosettePaths(curves = 22, steps = 90, size = 100): string[] {
  const rx = 0.35;
  const ry = -0.5;
  const half = size / 2;
  const scale = size / 3.4;
  return rosettePoints(curves, steps).map((curve) =>
    curve
      .map(([x, y, z], i) => {
        const y1 = y * Math.cos(rx) - z * Math.sin(rx);
        const z1 = y * Math.sin(rx) + z * Math.cos(rx);
        const x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
        return `${i ? "L" : "M"}${(half + x2 * scale).toFixed(1)} ${(half - y1 * scale).toFixed(1)}`;
      })
      .join(""),
  );
}
