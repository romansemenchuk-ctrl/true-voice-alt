/* @jsx React.createElement */
/* =========================================================
   VoiceColumn — кінематографічний 3D hero визуал для TRUE VOICE
   
   Концепт: голос як вертикальний стовп тіла.
   • центральна світлова вісь — резонансна колона
   • кільця-тороїди, що дихають у такт (5.6 с цикл)
   • вертикальна аудіо-хвиля (vu-meter) проходить по колоні
   • частинки повітря/диму навколо
   • малиновий bloom на видиху, золоті іскри на вдиху
   
   Чисто Canvas 2D, ~500 частинок, без WebGL.
   Дбайливо до батареї: подвійний rAF clamp + DPR cap + idle deopt.
   prefers-reduced-motion → один статичний кадр.
   ========================================================= */

const { useEffect: useVCEffect, useRef: useVCRef, useState: useVCState } = React;

function VoiceColumn({ accent = '#C8102E', density = 1, reduced: reducedProp, intensity = 1 }) {
  const canvasRef = useVCRef(null);
  const rafRef    = useVCRef(0);
  const visibleRef= useVCRef(true);

  const [reduced, setReduced] = useVCState(false);
  useVCEffect(() => {
    if (typeof reducedProp === 'boolean') { setReduced(reducedProp); return; }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const fn = (e) => setReduced(e.matches);
    mq.addEventListener?.('change', fn);
    return () => mq.removeEventListener?.('change', fn);
  }, [reducedProp]);

  useVCEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let W = 0, H = 0, DPR = 1;
    const isSmall = window.innerWidth < 720;

    // ── particle field around the column ───────────────────
    const dustN = Math.round((isSmall ? 130 : 220) * density);
    const dust = [];
    for (let i = 0; i < dustN; i++) {
      dust.push({
        // cylindrical coords around column
        r:  0.25 + Math.random() * 1.6,      // radius from axis
        a:  Math.random() * Math.PI * 2,     // angle
        y:  (Math.random() - 0.5) * 2.4,     // vertical
        vy: (Math.random() - 0.5) * 0.0006,  // tiny drift
        va: (0.0008 + Math.random() * 0.0024) * (Math.random() < 0.5 ? 1 : -1),
        seed: Math.random(),
        size: 0.4 + Math.random() * 1.1,
      });
    }

    // ── breathing rings around the column ──────────────────
    const ringsN = isSmall ? 5 : 7;
    const rings = [];
    for (let i = 0; i < ringsN; i++) {
      rings.push({
        y: -1.2 + (i / (ringsN - 1)) * 2.4,
        rBase: 0.55 + 0.05 * Math.sin(i * 1.7),
        phaseOff: i * 0.25,
        tilt: 0.30 + Math.sin(i * 0.7) * 0.04,
      });
    }

    // ── points on each ring (sampled) ──────────────────────
    const ringPts = isSmall ? 56 : 84;
    const cosT = new Float32Array(ringPts);
    const sinT = new Float32Array(ringPts);
    for (let i = 0; i < ringPts; i++) {
      const a = (i / ringPts) * Math.PI * 2;
      cosT[i] = Math.cos(a);
      sinT[i] = Math.sin(a);
    }

    // ── audio-wave samples along the central column ───────
    const waveN = 48;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 1.75);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width  = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function hexToRGBA(hex, a) {
      const h = hex.replace('#', '');
      const r = parseInt(h.length === 3 ? h[0]+h[0] : h.slice(0,2), 16);
      const g = parseInt(h.length === 3 ? h[1]+h[1] : h.slice(2,4), 16);
      const b = parseInt(h.length === 3 ? h[2]+h[2] : h.slice(4,6), 16);
      return `rgba(${r},${g},${b},${a})`;
    }

    function project(x, y, z, cx, cy, scale) {
      const persp = 1 / (1 - z * 0.0010);
      return {
        x: cx + x * scale * persp,
        y: cy + y * scale * persp,
        s: persp,
      };
    }

    function frame(now) {
      const t = now * 0.001;

      // breath cycle — 5.6 s; eased + held briefly at full
      const cyc = (t % 5.6) / 5.6;
      const breath = 0.5 - 0.5 * Math.cos(cyc * Math.PI * 2);   // 0..1..0
      const exhale = cyc > 0.5;

      // camera placement — column is the X axis (vertical in screen)
      const cx = W * 0.5;
      const cy = H * 0.5;
      const scale = Math.min(W * 1.05, H * 0.62);

      // yaw rotation (very slow)
      const yaw = t * 0.07;
      const cosY = Math.cos(yaw), sinY = Math.sin(yaw);

      ctx.clearRect(0, 0, W, H);

      // ── pass 1: VERTICAL VOICE BEAM (the column itself) ──
      // a soft vertical gradient pole with a hotter pulsing core.
      {
        const beamX = cx;
        const beamW = Math.max(28, scale * 0.10) * (0.85 + breath * 0.35) * intensity;
        const top = cy - H * 0.50;
        const bot = cy + H * 0.50;

        // outer halo
        const halo = ctx.createLinearGradient(beamX, top, beamX, bot);
        halo.addColorStop(0,    'rgba(245,245,242,0)');
        halo.addColorStop(0.18, hexToRGBA(accent, 0.05 + breath * 0.05));
        halo.addColorStop(0.5,  hexToRGBA(accent, 0.12 + breath * 0.10));
        halo.addColorStop(0.82, hexToRGBA(accent, 0.05 + breath * 0.05));
        halo.addColorStop(1,    'rgba(245,245,242,0)');
        ctx.fillStyle = halo;
        ctx.fillRect(beamX - beamW * 2.2, top, beamW * 4.4, bot - top);

        // hot core line
        const core = ctx.createLinearGradient(beamX, top, beamX, bot);
        core.addColorStop(0,    'rgba(245,245,242,0)');
        core.addColorStop(0.10, 'rgba(245,245,242,0.10)');
        core.addColorStop(0.5,  exhale ? hexToRGBA(accent, 0.95) : 'rgba(245,232,200,0.85)');
        core.addColorStop(0.90, 'rgba(245,245,242,0.10)');
        core.addColorStop(1,    'rgba(245,245,242,0)');
        ctx.strokeStyle = core;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(beamX, top);
        ctx.lineTo(beamX, bot);
        ctx.stroke();

        // soft thin guide on either side
        ctx.strokeStyle = 'rgba(245,245,242,0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(beamX - beamW * 1.6, top);
        ctx.lineTo(beamX - beamW * 1.6, bot);
        ctx.moveTo(beamX + beamW * 1.6, top);
        ctx.lineTo(beamX + beamW * 1.6, bot);
        ctx.stroke();
      }

      // ── pass 2: VERTICAL AUDIO WAVE travelling up the column ─
      {
        // a moving wave: amplitude bumps that drift upward
        for (let pass = 0; pass < 2; pass++) {
          ctx.beginPath();
          for (let i = 0; i <= waveN; i++) {
            const f = i / waveN;
            const y = -1.2 + f * 2.4;
            // travelling wave: phase shifts up over time
            const phase = (t * 0.55) + f * 6.4 + pass * 0.18;
            const amp = (0.06 + 0.04 * Math.sin(t * 0.7 + f * 4))
                      * (0.55 + breath * 0.55)
                      * (1 - Math.abs(f - 0.5) * 0.7);   // squash near edges
            const offset = Math.sin(phase) * amp;

            // project
            const p = project(offset, y, 0, cx, cy, scale);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else         ctx.lineTo(p.x, p.y);
          }
          ctx.strokeStyle = pass === 0
            ? `rgba(245,245,242,${0.18 + breath * 0.20})`
            : hexToRGBA(accent, (0.30 + breath * 0.30) * (exhale ? 1 : 0.6));
          ctx.lineWidth = pass === 0 ? 1.2 : 1.5;
          ctx.stroke();
        }
      }

      // ── pass 3: BREATHING RINGS ──────────────────────────
      // each ring is a 3D circle in the XZ plane at y=ring.y.
      // we sample ringPts points, project, and stroke. Color shifts
      // red on exhale and a hint of gold on inhale.
      for (const ring of rings) {
        const phase = (t / 5.6 + ring.phaseOff) % 1;       // 0..1
        const localBreath = 0.5 - 0.5 * Math.cos(phase * Math.PI * 2);
        const r = ring.rBase * (0.7 + localBreath * 0.55) * (1 + 0.05 * Math.sin(t * 0.6));

        ctx.beginPath();
        for (let i = 0; i <= ringPts; i++) {
          const idx = i % ringPts;
          // ring in xz plane, rotated by yaw
          const x0 = cosT[idx] * r;
          const z0 = sinT[idx] * r;
          // tilt
          const y = ring.y + sinT[idx] * ring.tilt * 0.05;
          // yaw rotate
          const x =  x0 * cosY - z0 * sinY;
          const z =  x0 * sinY + z0 * cosY;
          const p = project(x, y, z, cx, cy, scale);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else         ctx.lineTo(p.x, p.y);
        }
        // depth fade: rings further from center column dim
        const distFromMid = Math.abs(ring.y) / 1.2;
        const baseA = (0.22 - distFromMid * 0.10) * (0.7 + localBreath * 0.6);
        const tinted = phase > 0.5
          ? hexToRGBA(accent, baseA * 1.3)
          : `rgba(245,232,200,${baseA * 0.9})`;
        ctx.strokeStyle = tinted;
        ctx.lineWidth = 1;
        ctx.stroke();

        // ── ring "joint" particles — a few dots on the ring ─
        const dotsOnRing = 5;
        for (let d = 0; d < dotsOnRing; d++) {
          const a = (d / dotsOnRing) * Math.PI * 2 + t * 0.3 * (ring.y > 0 ? 1 : -1);
          const x0 = Math.cos(a) * r;
          const z0 = Math.sin(a) * r;
          const x =  x0 * cosY - z0 * sinY;
          const z =  x0 * sinY + z0 * cosY;
          const p = project(x, ring.y, z, cx, cy, scale);
          const dotA = baseA * (0.7 + 0.6 * Math.sin(t * 1.4 + d * 1.7 + ring.phaseOff * 4));
          ctx.fillStyle = (phase > 0.5)
            ? hexToRGBA(accent, dotA * 1.4)
            : `rgba(245,245,242,${dotA * 1.1})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.6 * p.s, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── pass 4: DUST PARTICLES (cylindrical drift) ──────
      // animate, project, sort would be ideal but cheap blend looks fine.
      for (let i = 0; i < dust.length; i++) {
        const p = dust[i];
        p.a += p.va;
        p.y += p.vy + Math.sin(t * 0.5 + p.seed * 6.28) * 0.0004;
        if (p.y >  1.4) p.y = -1.4;
        if (p.y < -1.4) p.y =  1.4;

        const x0 = Math.cos(p.a) * p.r;
        const z0 = Math.sin(p.a) * p.r;
        // rotate around column by yaw
        const x =  x0 * cosY - z0 * sinY;
        const z =  x0 * sinY + z0 * cosY;
        // small horizontal wobble that follows the wave going up
        const wobble = Math.sin(t * 0.6 + p.y * 4) * 0.02;
        const proj = project(x + wobble, p.y, z, cx, cy, scale);

        // depth alpha
        const depth = 0.55 + (z + 1.6) / 3.2;
        const baseA = (0.10 + depth * 0.55) * (0.7 + p.seed * 0.6);
        let alpha = baseA;
        let color;

        // particles near the column glow on exhale; far ones stay cool
        if (p.r < 0.7 && exhale && p.seed < 0.45) {
          color = hexToRGBA(accent, alpha * (0.7 + breath * 0.7));
          alpha *= 1.2;
        } else if (p.seed > 0.94) {
          color = `rgba(245,232,200,${alpha * 0.9})`;   // gold sparks
        } else {
          color = `rgba(245,245,242,${alpha * 0.8})`;
        }

        ctx.fillStyle = color;
        const rad = p.size * (0.6 + proj.s * 0.7);
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── pass 5: central radial bloom (additive feel) ────
      {
        const bloomA = (0.06 + breath * 0.14) * (exhale ? 1.25 : 0.7) * intensity;
        const radial = ctx.createRadialGradient(
          cx, cy, 0,
          cx, cy, Math.max(W, H) * 0.55
        );
        radial.addColorStop(0,   hexToRGBA(accent, bloomA));
        radial.addColorStop(0.35,hexToRGBA(accent, bloomA * 0.35));
        radial.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, W, H);
      }

      // top + bottom column "caps" (subtle horizon kisses)
      {
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0,    'rgba(11,11,13,0.55)');
        grad.addColorStop(0.18, 'rgba(11,11,13,0)');
        grad.addColorStop(0.82, 'rgba(11,11,13,0)');
        grad.addColorStop(1,    'rgba(11,11,13,0.60)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    function start() {
      if (!rafRef.current && !reduced) {
        rafRef.current = requestAnimationFrame(frame);
      }
    }
    function stop() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    function onVis() {
      visibleRef.current = !document.hidden;
      if (document.hidden) stop();
      else start();
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', onVis);

    if (!reduced) {
      start();
    } else {
      frame(performance.now());  // one static frame
    }

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [accent, density, reduced, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="tv-voice-column"
      aria-hidden="true"
    />
  );
}

window.VoiceColumn = VoiceColumn;
// keep BreathField name as alias so older code doesn't break
window.BreathField = VoiceColumn;
