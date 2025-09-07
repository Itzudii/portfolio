import { hexToRgb } from "./useful.js";

export class LightSpot {
  // color: CSS hex like "#ffd966" or "#be83b5"
  // intensity: 0..1 (how much darkness to remove at center)
  // tint: 0..1 (how strong the color shows at center)
  constructor(color = "#ffd966", intensity = 0.7, tint = 0.35) {
    this.color = color;
    this.rgb = hexToRgb(color);
    this.intensity = intensity;
    this.tint = tint;
  }

  // Only computes radius & returns it (so both passes use the same radius)
  radius(baseRadius, FSize, FSpeed) {
    return baseRadius + Math.sin(performance.now() / FSpeed) * FSize;
  }

  // PASS 1: reduce darkness (alpha-only gradient)
  carve(ctx, x, y, radius) {
    const g = ctx.createRadialGradient(x, y, 10, x, y, radius);
    g.addColorStop(0, `rgba(0,0,0,${this.intensity})`);
    g.addColorStop(1, `rgba(0,0,0,0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // PASS 2: add colored glow (color gradient)
  tintGlow(ctx, x, y, radius) {
    const { r, g, b } = this.rgb;
    const g2 = ctx.createRadialGradient(x, y, 10, x, y, radius);
    g2.addColorStop(0, `rgba(${r},${g},${b},${this.tint})`);
    g2.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}