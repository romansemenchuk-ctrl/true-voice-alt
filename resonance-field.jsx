/* @jsx React.createElement */
/* =========================================================
   ResonanceField — signature hero centerpiece (Alt page).

   Метафора: голос як резонанс, що дихає.
   • central live oscilloscope waveform (sum of sines + drift),
     amplitude modulated by a slow breath cycle
   • concentric resonance rings emanating from центру, що
     "запалюються" акцентом на видиху (exhale)
   • frequency spectrum bars mirrored from center
   • drifting dust that ignites near expanding rings
   • mouse-reactive focal point (parallax of the whole field)
   • intro ignition burst on mount
   Canvas 2D, DPR-capped. No WebGL.
   ========================================================= */

const { useEffect: useRFEffect, useRef: useRFRef, useState: useRFState } = React;

function ResonanceField({ accent = '#E60012', reduced: reducedProp, intensity = 1 }) {
  const canvasRef = useRFRef(null);
  const rafRef    = useRFRef(0);
  const pointerRef = useRFRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false });

  const [reduced, setReduced] = useRFState(false);
  useRFEffect(() => {
    if (typeof reducedProp === 'boolean') { setReduced(reducedProp); return; }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const fn = (e) => setReduced(e.matches);
    mq.addEventListener?.('change', fn);
    return () => mq.removeEventListener?.('change', fn);
  }, [reducedProp]);

  useRFEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let W = 0, H = 0, DPR = 1;
    const isSmall = () => window.innerWidth < 760;

    function hexToRGB(hex) {
      const h = hex.replace('#', '');
      return {
        r: parseInt(h.length === 3 ? h[0]+h[0] : h.slice(0,2), 16),
        g: parseInt(h.length === 3 ? h[1]+h[1] : h.slice(2,4), 16),
        b: parseInt(h.length === 3 ? h[2]+h[2] : h.slice(4,6), 16),
      };
    }
    let RGB = hexToRGB(accent);
    const acc = (a) => `rgba(${RGB.r},${RGB.g},${RGB.b},${a})`;
    const air = (a) => `rgba(246,244,240,${a})`;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 1.75);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width  = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    // ── resonance rings ──────────────────────────────────
    const rings = [];
    function spawnRing(t, strength) {
      rings.push({ born: t, life: 3.4 + Math.random() * 0.6, strength });
    }

    // ── dust ─────────────────────────────────────────────
    let dust = [];
    function seedDust() {
      const n = Math.round((isSmall() ? 44 : 84) * intensity);
      dust = [];
      for (let i = 0; i < n; i++) {
        dust.push({
          x: Math.random(), y: Math.random(),
          vx: (Math.random() - 0.5) * 0.00012,
          vy: (Math.random() - 0.5) * 0.0001 - 0.00003,
          size: 0.5 + Math.random() * 1.4,
          seed: Math.random(),
        });
      }
    }

    const t0 = performance.now() * 0.001;
    let lastSpawn = -10;

    function frame(now) {
      const t = now * 0.001;
      const elapsed = t - t0;

      // breath cycle — 6.2s. 0..1..0 (inhale rise, exhale fall)
      const cyc = (t % 6.2) / 6.2;
      const breath = 0.5 - 0.5 * Math.cos(cyc * Math.PI * 2); // 0..1..0
      const exhale = cyc > 0.5; // expelling air → voice
      // intro ramp (0..1 over first 1.4s)
      const intro = Math.min(1, elapsed / 1.4);
      const introEase = intro * intro * (3 - 2 * intro);

      // pointer lerp
      const p = pointerRef.current;
      p.x += (p.tx - p.x) * 0.06;
      p.y += (p.ty - p.y) * 0.06;
      const focalX = (p.x - 0.5) * W * 0.06;
      const focalY = (p.y - 0.5) * H * 0.05;

      const cxC = W * 0.5 + focalX;
      const cyC = H * 0.5 + focalY;

      ctx.clearRect(0, 0, W, H);

      // ── radial ground glow ───────────────────────────────
      {
        const maxR = Math.hypot(W, H) * 0.6;
        const g = ctx.createRadialGradient(cxC, cyC, 0, cxC, cyC, maxR);
        g.addColorStop(0,    acc(0.10 * introEase + breath * 0.05));
        g.addColorStop(0.35, acc(0.04 + breath * 0.025));
        g.addColorStop(1,    'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // ── spawn rings on exhale beats ──────────────────────
      // rhythmic ~1.55s; stronger on exhale
      if (t - lastSpawn > 1.55) {
        lastSpawn = t;
        spawnRing(t, exhale ? 1 : 0.55);
      }
      // intro ignition
      if (elapsed > 0.15 && elapsed < 0.22 && rings.length === 0) spawnRing(t, 1.4);

      // ── resonance rings ──────────────────────────────────
      const baseR = Math.min(W, H) * (isSmall() ? 0.30 : 0.24);
      const maxRr = Math.max(W, H) * 0.62;
      ctx.save();
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        const age = (t - ring.born) / ring.life;
        if (age >= 1) { rings.splice(i, 1); continue; }
        const ease = 1 - Math.pow(1 - age, 2.4);
        const r = baseR * 0.35 + ease * (maxRr - baseR * 0.35);
        const fade = (1 - age) * (1 - age);
        const a = fade * 0.5 * ring.strength * introEase;
        if (a <= 0.004) continue;
        // accent core when young, cools to air as it expands
        const heat = Math.max(0, 1 - age * 1.7);
        const rx = r, ry = r * 0.86; // slight perspective squash
        ctx.beginPath();
        ctx.ellipse(cxC, cyC, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = heat > 0.04
          ? acc(a * (0.6 + heat))
          : air(a * 0.5);
        ctx.lineWidth = (0.7 + heat * 1.8) * (1 + ring.strength * 0.4);
        ctx.stroke();
      }
      ctx.restore();

      // ── frequency spectrum (mirrored bars at baseline) ───
      const midY = cyC;
      {
        const bars = isSmall() ? 26 : 46;
        const spanW = Math.min(W * 0.92, 1180);
        const x0 = cxC - spanW / 2;
        const gap = spanW / (bars * 2);
        const baseY = midY + Math.min(H * 0.30, 230);
        for (let b = 0; b < bars; b++) {
          const u = b / (bars - 1); // 0..1
          // taper at edges
          const edge = Math.sin(u * Math.PI);
          const mag =
            Math.abs(Math.sin(t * 1.4 + b * 0.55)) * 0.5 +
            Math.abs(Math.sin(t * 2.3 + b * 0.27)) * 0.3 +
            Math.abs(Math.sin(t * 0.7 + b * 0.9)) * 0.2;
          const hgt = (8 + mag * 86 * (0.5 + breath * 0.9)) * edge * introEase;
          // mirror left/right from center
          for (const dir of [-1, 1]) {
            const x = cxC + dir * (gap + b * gap * 2);
            if (x < x0 || x > x0 + spanW) continue;
            const heat = 0.25 + breath * 0.5;
            ctx.fillStyle = acc(0.14 + heat * 0.18 * edge);
            ctx.fillRect(x - 1, baseY - hgt, 2, hgt);
            // mirrored faint reflection downward
            ctx.fillStyle = acc(0.05 * edge);
            ctx.fillRect(x - 1, baseY + 2, 2, hgt * 0.35);
          }
        }
        // baseline
        ctx.strokeStyle = air(0.06 + breath * 0.05);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cxC - spanW / 2, baseY);
        ctx.lineTo(cxC + spanW / 2, baseY);
        ctx.stroke();
      }

      // ── central oscilloscope waveform ────────────────────
      const waveSpan = Math.min(W * 0.96, 1320);
      const wx0 = cxC - waveSpan / 2;
      const amp = (10 + breath * 64 + (exhale ? 14 : 0)) * intensity * introEase;
      function drawWave(ampMul, alpha, lw, hot) {
        ctx.beginPath();
        const steps = isSmall() ? 96 : 200;
        for (let s = 0; s <= steps; s++) {
          const f = s / steps;
          const x = wx0 + f * waveSpan;
          // envelope — louder in the middle, tapered at ends
          const env = Math.pow(Math.sin(f * Math.PI), 1.3);
          const ph = f * Math.PI * 2;
          const y = midY + (
              Math.sin(ph * 5.0 + t * 2.2) * 1.0 +
              Math.sin(ph * 9.0 - t * 1.6) * 0.55 +
              Math.sin(ph * 17.0 + t * 3.1) * 0.28 +
              Math.sin(ph * 2.0 + t * 0.9) * 0.7
            ) * amp * ampMul * env;
          if (s === 0) ctx.moveTo(x, y);
          else         ctx.lineTo(x, y);
        }
        ctx.strokeStyle = hot ? acc(alpha) : air(alpha);
        ctx.lineWidth = lw;
        ctx.shadowBlur = hot ? 18 : 0;
        ctx.shadowColor = hot ? acc(0.6) : 'transparent';
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      // back echo (air), then hot accent core, then bright air filament
      drawWave(1.35, 0.10 + breath * 0.06, 1, false);
      drawWave(1.0, 0.55 + breath * 0.3, 1.8 + breath * 1.2, true);
      drawWave(1.0, 0.7, 0.9, false);

      // center node — the "voice source"
      {
        const pr = (3 + breath * 7) * introEase;
        const g = ctx.createRadialGradient(cxC, midY, 0, cxC, midY, pr * 6);
        g.addColorStop(0, acc(0.9 * introEase));
        g.addColorStop(0.4, acc(0.4 * introEase));
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(cxC - pr * 6, midY - pr * 6, pr * 12, pr * 12);
        ctx.fillStyle = air(0.95 * introEase);
        ctx.beginPath();
        ctx.arc(cxC, midY, Math.max(1.2, pr * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }

      // ── dust, igniting near ring fronts ──────────────────
      for (let i = 0; i < dust.length; i++) {
        const d = dust[i];
        d.x += d.vx; d.y += d.vy + Math.sin(t * 0.4 + d.seed * 6) * 0.00004;
        if (d.x > 1.05) d.x = -0.05; if (d.x < -0.05) d.x = 1.05;
        if (d.y > 1.05) d.y = -0.05; if (d.y < -0.05) d.y = 1.05;
        const px = d.x * W, py = d.y * H;
        // distance from center, ignite if a ring front is near
        const dr = Math.hypot(px - cxC, (py - cyC) / 0.86);
        let hot = 0;
        for (const ring of rings) {
          const age = (t - ring.born) / ring.life;
          const ease = 1 - Math.pow(1 - age, 2.4);
          const fr = baseR * 0.35 + ease * (maxRr - baseR * 0.35);
          const dd = Math.abs(dr - fr);
          if (dd < 26) hot = Math.max(hot, (1 - dd / 26) * (1 - age) * ring.strength);
        }
        const a = (0.16 + d.seed * 0.3) * (0.4 + breath * 0.4) * introEase;
        ctx.fillStyle = hot > 0.04 ? acc(Math.min(1, a + hot * 0.9)) : air(a * 0.7);
        ctx.beginPath();
        ctx.arc(px, py, d.size * (0.7 + hot * 1.6), 0, Math.PI * 2);
        ctx.fill();
      }

      // ── top/bottom horizon vignette ──────────────────────
      {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0,    'rgba(6,6,7,0.85)');
        g.addColorStop(0.22, 'rgba(6,6,7,0)');
        g.addColorStop(0.80, 'rgba(6,6,7,0)');
        g.addColorStop(1,    'rgba(6,6,7,0.92)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    function start() { if (!rafRef.current && !reduced) rafRef.current = requestAnimationFrame(frame); }
    function stop()  { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
    function onVis() { if (document.hidden) stop(); else start(); }

    function onMove(e) {
      const p = pointerRef.current;
      p.tx = e.clientX / window.innerWidth;
      p.ty = e.clientY / window.innerHeight;
      p.active = true;
    }

    resize();
    seedDust();
    window.addEventListener('resize', () => { resize(); seedDust(); }, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    if (!reduced) start(); else { resize(); frame(performance.now()); }

    return () => {
      stop();
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [accent, reduced, intensity]);

  return (
    <canvas ref={canvasRef} className="rf-canvas" aria-hidden="true" />
  );
}

window.ResonanceField = ResonanceField;
