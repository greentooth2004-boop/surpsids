/**
 * Fireworks engine — self-managing full-screen canvas. Supports rockets that
 * burst, a finale barrage, and spelling a name in golden particles.
 */

type P = {
  x: number; y: number; vx: number; vy: number; life: number; t: number;
  color: string; r: number; gravity: number; fade: number; trail: boolean;
};

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let parts: P[] = [];
let raf = 0;
let dpr = 1;

const COLORS = ["#ffd1e8", "#ffb3d1", "#e9c2ff", "#d8b4fe", "#ffe0b3", "#fff3b0", "#ffffff", "#c9f0d9"];

function ensure() {
  if (canvas) return;
  canvas = document.createElement("canvas");
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:55;";
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
    p.vy += p.gravity;
    p.vx *= 0.99;
    p.x += p.vx;
    p.y += p.vy;
    const a = Math.max(0, 1 - p.t / p.life);
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    if (p.t > p.life) parts.splice(i, 1);
  }
  ctx.restore();
  if (parts.length > 0) raf = requestAnimationFrame(loop);
  else {
    cancelAnimationFrame(raf);
    raf = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function burst(x: number, y: number, color: string, n = 70) {
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2 + Math.random() * 0.3;
    const sp = 1 + Math.random() * 4;
    parts.push({
      x, y,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp,
      life: 1.2 + Math.random() * 1.2,
      t: 0,
      color,
      r: 1.5 + Math.random() * 2,
      gravity: 0.03,
      fade: 1,
      trail: true,
    });
  }
}

export function launchFirework(x?: number, y?: number, color?: string) {
  ensure();
  const W = window.innerWidth;
  const H = window.innerHeight;
  const tx = x ?? Math.random() * W;
  const ty = y ?? H * (0.15 + Math.random() * 0.4);
  const c = color ?? COLORS[(Math.random() * COLORS.length) | 0];
  burst(tx, ty, c);
  if (!raf) raf = requestAnimationFrame(loop);
}

/** Sample text pixels and turn them into slow golden particles (spells a name). */
export function spellText(text: string) {
  ensure();
  if (!ctx || !canvas) return;
  const W = window.innerWidth;
  const H = window.innerHeight;
  const off = document.createElement("canvas");
  off.width = W;
  off.height = H;
  const octx = off.getContext("2d")!;
  const fs = Math.min(W * 0.18, H * 0.16);
  octx.fillStyle = "#fff";
  octx.textAlign = "center";
  octx.textBaseline = "middle";
  octx.font = `700 ${fs}px Georgia, 'Times New Roman', serif`;
  octx.fillText(text, W / 2, H * 0.4);
  const img = octx.getImageData(0, 0, W, H).data;
  const step = Math.max(4, Math.floor(fs / 22));
  let count = 0;
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const idx = (y * W + x) * 4;
      if (img[idx + 3] > 128) {
        count++;
        if (count % 2) continue;
        const hue = 45 + Math.random() * 15;
        parts.push({
          x: W / 2 + (Math.random() - 0.5) * 20,
          y: H * 0.2 + (Math.random() - 0.5) * 20,
          vx: (x - W / 2) * 0.012,
          vy: (y - H * 0.4) * 0.012,
          life: 2.5 + Math.random(),
          t: 0,
          color: `hsl(${hue}, 100%, ${70 + Math.random() * 20}%)`,
          r: 1.6 + Math.random() * 1.6,
          gravity: 0.005,
          fade: 1,
          trail: false,
        });
      }
    }
  }
  if (!raf) raf = requestAnimationFrame(loop);
}

export function fireworksFinale(name: string) {
  ensure();
  let n = 0;
  const iv = setInterval(() => {
    launchFirework();
    if (++n >= 6) {
      clearInterval(iv);
      setTimeout(() => spellText(name), 400);
      setTimeout(() => {
        let m = 0;
        const iv2 = setInterval(() => {
          launchFirework();
          if (++m >= 10) clearInterval(iv2);
        }, 300);
      }, 1800);
    }
  }, 350);
}
