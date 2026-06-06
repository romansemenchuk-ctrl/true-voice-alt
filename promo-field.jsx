/* @jsx React.createElement */
/* =========================================================
   PromoField — deterministic resonance field for the promo
   video. Driven by the Stage timeline (useTime), so it is
   fully scrub-safe and exports cleanly. Same visual language
   as the site hero: breathing waveform + resonance rings +
   spectrum, pure black / blood red / air.
   ========================================================= */

const { useEffect: usePFEffect, useRef: usePFRef } = React;

function PromoField({ accent = '#E60012', intensity = 1, W = 1920, H = 1080 }) {
  const canvasRef = usePFRef(null);
  const t = window.useTime ? window.useTime() : 0;

  usePFEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (canvas.width !== W) { canvas.width = W; canvas.height = H; }

    const h = accent.replace('#', '');
    const R = parseInt(h.slice(0, 2), 16), G = parseInt(h.slice(2, 4), 16), B = parseInt(h.slice(4, 6), 16);
    const acc = (a) => `rgba(${R},${G},${B},${a})`;
    const air = (a) => `rgba(246,244,240,${a})`;

    const cx = W * 0.5, cy = H * 0.5;
    // breath cycle 6.2s
    const cyc = (t % 6.2) / 6.2;
    const breath = 0.5 - 0.5 * Math.cos(cyc * Math.PI * 2);
    const intro = Math.min(1, t / 1.3);
    const introE = intro * intro * (3 - 2 * intro);
    const I = intensity * introE;

    ctx.clearRect(0, 0, W, H);

    // radial ground glow
    {
      const maxR = Math.hypot(W, H) * 0.6;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      g.addColorStop(0, acc(0.12 * I + breath * 0.05));
      g.addColorStop(0.35, acc(0.04 + breath * 0.025));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // resonance rings — deterministic, spawned every 1.5s
    const baseR = Math.min(W, H) * 0.20;
    const maxRr = Math.max(W, H) * 0.62;
    const life = 3.8, interval = 1.5;
    const firstK = Math.floor((t - life) / interval) - 1;
    const lastK = Math.floor(t / interval) + 1;
    for (let k = firstK; k <= lastK; k++) {
      const born = k * interval;
      if (born < 0) continue;
      const age = (t - born) / life;
      if (age < 0 || age >= 1) continue;
      const ease = 1 - Math.pow(1 - age, 2.4);
      const r = baseR * 0.3 + ease * (maxRr - baseR * 0.3);
      const fade = (1 - age) * (1 - age);
      const strength = (k % 2 === 0) ? 1 : 0.6;
      const a = fade * 0.5 * strength * I;
      if (a <= 0.004) continue;
      const heat = Math.max(0, 1 - age * 1.7);
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.86, 0, 0, Math.PI * 2);
      ctx.strokeStyle = heat > 0.04 ? acc(a * (0.6 + heat)) : air(a * 0.5);
      ctx.lineWidth = (0.8 + heat * 2.2) * (1 + strength * 0.4);
      ctx.stroke();
    }

    // frequency spectrum (mirrored at baseline)
    {
      const bars = 52;
      const spanW = Math.min(W * 0.9, 1500);
      const x0 = cx - spanW / 2, gap = spanW / (bars * 2);
      const baseY = cy + 320;
      for (let b = 0; b < bars; b++) {
        const u = b / (bars - 1);
        const edge = Math.sin(u * Math.PI);
        const mag =
          Math.abs(Math.sin(t * 1.4 + b * 0.55)) * 0.5 +
          Math.abs(Math.sin(t * 2.3 + b * 0.27)) * 0.3 +
          Math.abs(Math.sin(t * 0.7 + b * 0.9)) * 0.2;
        const hgt = (10 + mag * 120 * (0.5 + breath * 0.9)) * edge * I;
        for (const dir of [-1, 1]) {
          const x = cx + dir * (gap + b * gap * 2);
          if (x < x0 || x > x0 + spanW) continue;
          ctx.fillStyle = acc(0.12 + (0.25 + breath * 0.5) * 0.18 * edge);
          ctx.fillRect(x - 1.5, baseY - hgt, 3, hgt);
          ctx.fillStyle = acc(0.05 * edge);
          ctx.fillRect(x - 1.5, baseY + 3, 3, hgt * 0.34);
        }
      }
      ctx.strokeStyle = air(0.06 + breath * 0.05);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(cx - spanW / 2, baseY);
      ctx.lineTo(cx + spanW / 2, baseY);
      ctx.stroke();
    }

    // central oscilloscope waveform
    const waveSpan = Math.min(W * 0.95, 1640);
    const wx0 = cx - waveSpan / 2;
    const amp = (14 + breath * 86 + intensity * 18) * I;
    function drawWave(ampMul, alpha, lw, hot) {
      ctx.beginPath();
      const steps = 240;
      for (let s = 0; s <= steps; s++) {
        const f = s / steps;
        const x = wx0 + f * waveSpan;
        const env = Math.pow(Math.sin(f * Math.PI), 1.3);
        const ph = f * Math.PI * 2;
        const y = cy + (
          Math.sin(ph * 5 + t * 2.2) * 1.0 +
          Math.sin(ph * 9 - t * 1.6) * 0.55 +
          Math.sin(ph * 17 + t * 3.1) * 0.28 +
          Math.sin(ph * 2 + t * 0.9) * 0.7
        ) * amp * ampMul * env;
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = hot ? acc(alpha) : air(alpha);
      ctx.lineWidth = lw;
      ctx.shadowBlur = hot ? 26 : 0;
      ctx.shadowColor = hot ? acc(0.6) : 'transparent';
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    drawWave(1.35, 0.10 + breath * 0.06, 1.4, false);
    drawWave(1.0, 0.55 + breath * 0.3, 2.4 + breath * 1.6, true);
    drawWave(1.0, 0.7, 1.2, false);

    // center node
    {
      const pr = (4 + breath * 9) * I;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, pr * 6);
      g.addColorStop(0, acc(0.9 * I));
      g.addColorStop(0.4, acc(0.4 * I));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(cx - pr * 6, cy - pr * 6, pr * 12, pr * 12);
      ctx.fillStyle = air(0.95 * I);
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(1.5, pr * 0.5), 0, Math.PI * 2);
      ctx.fill();
    }

    // vignette
    {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, 'rgba(6,6,7,0.9)');
      g.addColorStop(0.24, 'rgba(6,6,7,0)');
      g.addColorStop(0.78, 'rgba(6,6,7,0)');
      g.addColorStop(1, 'rgba(6,6,7,0.95)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      const rg = ctx.createRadialGradient(cx, cy, H * 0.35, cx, cy, Math.hypot(W, H) * 0.55);
      rg.addColorStop(0, 'rgba(0,0,0,0)');
      rg.addColorStop(1, 'rgba(0,0,0,0.5)');
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, W, H);
    }
  }, [t, accent, intensity, W, H]);

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
}

window.PromoField = PromoField;
