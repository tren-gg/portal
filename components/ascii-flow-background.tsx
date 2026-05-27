const ASCII_FLOW_SCRIPT = `
(() => {
  const canvas = document.querySelector("[data-ascii-flow]");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const density = 14;
  const glyphs = ["─", "╲", "│", "╱", "·", "+", "×"];
  let raf = 0;
  let timer = 0;
  let cols = 0;
  let rows = 0;
  const cellW = density;
  const cellH = Math.round(density * 1.6);

  const hash = (x, y) => {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return n - Math.floor(n);
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => t * t * (3 - 2 * t);
  const noise = (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = smooth(xf);
    const v = smooth(yf);
    const a = hash(xi, yi);
    const b = hash(xi + 1, yi);
    const c = hash(xi, yi + 1);
    const d = hash(xi + 1, yi + 1);
    return lerp(lerp(a, b, u), lerp(c, d, u), v);
  };
  const schedule = (callback) => {
    if (window.requestAnimationFrame) {
      raf = window.requestAnimationFrame(callback);
      return;
    }
    timer = window.setTimeout(() => callback(Date.now()), 16);
  };

  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.ceil(window.innerWidth * dpr);
    canvas.height = Math.ceil(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = density + "px Geist Mono, SFMono-Regular, Menlo, Consolas, monospace";
    ctx.textBaseline = "top";
    cols = Math.ceil(window.innerWidth / cellW);
    rows = Math.ceil(window.innerHeight / cellH);
  };

  const paint = (time) => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const t = time * 0.00018;
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const n = noise(x * 0.06, y * 0.06 + t * 6);
        const m = noise(x * 0.02 + 100, y * 0.02 + t * 2 - 50);
        const angle = n * Math.PI * 2;
        const index = Math.floor((angle / (Math.PI * 2)) * glyphs.length) % glyphs.length;

        if (m > 0.78) ctx.fillStyle = "rgba(255,255,255,0.80)";
        else if (m > 0.66) ctx.fillStyle = "rgba(232,232,232,0.55)";
        else if (m > 0.55) ctx.fillStyle = "rgba(232,232,232,0.18)";
        else if (m > 0.42) ctx.fillStyle = "rgba(120,120,120,0.35)";
        else ctx.fillStyle = "rgba(60,60,60,0.55)";

        ctx.fillText(glyphs[index], x * cellW, y * cellH);
      }
    }

    schedule(paint);
  };

  const start = () => {
    resize();
    window.addEventListener("resize", resize, { passive: true });
    paint(0);
  };

  timer = window.setTimeout(start, 120);
  window.addEventListener("pagehide", () => {
    if (window.cancelAnimationFrame) window.cancelAnimationFrame(raf);
    window.clearTimeout(timer);
  }, { once: true });
})();
`;

export function AsciiFlowBackground({ className = "" }: { className?: string }) {
  return (
    <>
      <canvas
        data-ascii-flow
        aria-hidden="true"
        suppressHydrationWarning
        className={["pointer-events-none absolute inset-0 h-full w-full", className]
          .filter(Boolean)
          .join(" ")}
      />
      <script dangerouslySetInnerHTML={{ __html: ASCII_FLOW_SCRIPT }} />
    </>
  );
}
