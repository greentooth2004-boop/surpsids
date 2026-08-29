/**
 * Confetti engine — a self-managing full-screen canvas appended to <body>.
 * Call fireConfetti() from anywhere. Petals + classic confetti supported.
 */

type Particle = {
  x: number; y: number; vx: number; vy: number;
  rot: number; vr: number; w: number; h: number;
  color: string; life: number; t: number; petal: boolean; sway: number;
};

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let parts: Particle[] = [];
let raf = 0;
let dpr = 1;

const FLORAL = ["#ffd1e8", "#ffb3d1", "#e9c2ff", "#d8b4fe", "#ffe0b3", "#fff3b0", "#c9f0d9", "#ffffff"];

function ensure() {
  if (canvas) return;
  canvas = document.createElement("canvas");
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:60;";
  const resize = () => {
    if (!canvas) return;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
  };
  resize();
  window.addEventListener("resize", resize);
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");
}

function loop() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(dpr, dpr);
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.t += 1 / 60;
    p.vy += p.petal ? 0.012 : 0.09;
    p.vx *= 0.99;
    p.sway += 0.05;
    p.x += p.vx + (p.petal ? Math.sin(p.sway) * 0.6 : 0);
    p.y += p.vy;
    p.rot += p.vr;
    const alpha = Math.max(0, 1 - p.t / p.life);
    ctx.globalAlpha = alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    if (p.petal) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.w, p.h, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    }
    ctx.rotate(-p.rot);
    ctx.translate(-p.x, -p.y);
    if (p.y > window.innerHeight + 40 || p.t > p.life) parts.splice(i, 1);
  }
  ctx.restore();
  void window.innerWidth;
  if (parts.length > 0) raf = requestAnimationFrame(loop);
  else {
    cancelAnimationFrame(raf);
    raf = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

export function fireConfetti(opts: {
  count?: number;
  originX?: number; // 0..1
  originY?: number; // 0..1
  colors?: string[];
  petal?: boolean;
  power?: number;
} = {}) {
  ensure();
  const W = window.innerWidth;
  const H = window.innerHeight;
  const count = opts.count ?? 140;
  const ox = (opts.originX ?? 0.5) * W;
  const oy = (opts.originY ?? 0.4) * H;
  const colors = opts.colors ?? FLORAL;
  const power = opts.power ?? 1;
  for (let i = 0; i < count; i++) {
    const petal = opts.petal ?? Math.random() > 0.5;
    const angle = Math.random() * Math.PI * 2;
    const speed = (petal ? 1.5 : 4 + Math.random() * 8) * power;
    parts.push({
      x: ox,
      y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (petal ? 0.5 : 2),
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      w: petal ? 5 + Math.random() * 6 : 6 + Math.random() * 8,
      h: petal ? 3 + Math.random() * 3 : 6 + Math.random() * 8,
      color: colors[(Math.random() * colors.length) | 0],
      life: 2.5 + Math.random() * 2,
      t: 0,
      petal,
      sway: Math.random() * 10,
    });
  }
  if (!raf) raf = requestAnimationFrame(loop);
}
