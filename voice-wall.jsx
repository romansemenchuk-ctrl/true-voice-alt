/* @jsx React.createElement */
/* =========================================================
   VoiceWall — альтернативна hero-анімація для TRUE VOICE.

   Метафора: голос як натягнуті струни тіла.
   • ~90 вертикальних "струн", що повільно дихають
   • горизонтальний акустичний імпульс, що проходить зліва-направо
     (gaussian envelope) — локально вигинає струни і підпалює
     їх акцентним кольором
   • базове дихання амплітуди (5.6 с цикл) як у VoiceColumn
   • пилок/іскри спереду; легкий радіальний bloom
   • Canvas 2D, ~80 струн, без WebGL.
   ========================================================= */

const { useEffect: useVWEffect, useRef: useVWRef, useState: useVWState } = React;

function VoiceWall({ accent = '#C8102E', density = 1, reduced: reducedProp, intensity = 1 }) {
  const canvasRef = useVWRef(null);
  const rafRef    = useVWRef(0);

  const [reduced, setReduced] = useVWState(false);
  useVWEffect(() => {
    if (typeof reducedProp === 'boolean') { setReduced(reducedProp); return; }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const fn = (e) => setReduced(e.matches);
    mq.addEventListener?.('change', fn);
    return () => mq.removeEventListener?.('change', fn);
  }, [reducedProp]);

  useVWEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let W = 0, H = 0, DPR = 1;
    const isSmall = window.innerWidth < 720;

    // ── strings ────────────────────────────────────────────
    const stringsN = Math.round((isSmall ? 60 : 96) * density);
    const strings = [];
    for (let i = 0; i < stringsN; i++) {
      strings.push({
        // x-position normalized 0..1
        u: i / (stringsN - 1),
        phase: Math.random() * Math.PI * 2,
        freq:  0.7 + Math.random() * 0.6,
        len:   0.78 + Math.random() * 0.22,   // vertical length (of half height)
      });
    }

    // ── dust ──────────────────────────────────────────────
    const dustN = Math.round((isSmall ? 50 : 90) * density);
    const dust = [];
    for (let i = 0; i < dustN; i++) {
      dust.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.00015,
        vy: (Math.random() - 0.5) * 0.00012 - 0.00005,
        size: 0.5 + Math.random() * 1.2,
        seed: Math.random(),
      });
    }

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

    function frame(now) {
      const t = now * 0.001;

      // breath cycle — 5.6 s
      const cyc = (t % 5.6) / 5.6;
      const breath = 0.5 - 0.5 * Math.cos(cyc * Math.PI * 2);   // 0..1..0
      const exhale = cyc > 0.5;

      // pulse — every 4.2s a wave travels L→R
      const pulseDur = 4.2;
      const pulsePos = ((t % pulseDur) / pulseDur);   // 0..1 across screen
      const pulseSigma = 0.10;                         // width of gaussian

      ctx.clearRect(0, 0, W, H);

      // ── pass 1: soft vertical gradient behind strings ────
      {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0,    'rgba(11,11,13,0.0)');
        g.addColorStop(0.45, hexToRGBA(accent, 0.06 + breath * 0.04));
        g.addColorStop(0.55, hexToRGBA(accent, 0.06 + breath * 0.04));
        g.addColorStop(1,    'rgba(11,11,13,0.0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // ── pass 2: horizontal "ground line" ─────────────────
      ctx.strokeStyle = `rgba(245,232,200,${0.10 + breath * 0.10})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, H * 0.5);
      ctx.lineTo(W, H * 0.5);
      ctx.stroke();

      // ── pass 3: STRINGS ──────────────────────────────────
      const midY = H * 0.5;
      for (let i = 0; i < strings.length; i++) {
        const s = strings[i];
        const x = s.u * W;

        // distance from pulse center, gaussian
        const d = s.u - pulsePos;
        const env = Math.exp(-(d * d) / (2 * pulseSigma * pulseSigma));   // 0..1

        // string vertical extent
        const halfH = H * 0.45 * s.len;
        const top = midY - halfH;
        const bot = midY + halfH;

        // brightness profile — center of wall is brighter (a soft spotlight)
        const centerWeight = 1 - Math.abs(s.u - 0.5) * 1.2;
        const baseLight = Math.max(0.06, centerWeight) * (0.45 + breath * 0.35);

        // base sway (small)
        const swayAmp = 1.5 + breath * 4.5 + env * 22 * intensity;
        const segments = 14;

        ctx.beginPath();
        for (let k = 0; k <= segments; k++) {
          const f = k / segments;
          const y = top + f * (bot - top);
          // horizontal offset: combination of slow base sway + pulse displacement
          const phaseY = (y / H) * Math.PI * 2;
          const offset =
              Math.sin(t * s.freq + s.phase + phaseY * 1.4) * swayAmp * (0.5 + 0.5 * Math.sin(phaseY))
            + env * Math.sin(t * 3 + s.phase) * 4;
          if (k === 0) ctx.moveTo(x + offset, y);
          else         ctx.lineTo(x + offset, y);
        }

        // colour: cool white normally; accent when pulse passes through this string
        const heat = env;     // 0..1
        const aLine = baseLight * (0.7 + heat * 1.5) * intensity;
        const colCool = `rgba(245,245,242,${aLine})`;
        const colHot  = hexToRGBA(accent, Math.min(1, aLine * 1.6));
        // blend by drawing twice with subtle offset for heat
        ctx.strokeStyle = colCool;
        ctx.lineWidth = 0.8 + centerWeight * 0.4;
        ctx.stroke();

        if (heat > 0.05) {
          ctx.strokeStyle = colHot;
          ctx.lineWidth = 1.0 + heat * 1.4;
          ctx.stroke();
        }

        // small "node" dots at the string crossings with center axis (only when hot)
        if (heat > 0.18) {
          ctx.fillStyle = hexToRGBA(accent, heat * 0.9);
          ctx.beginPath();
          ctx.arc(x + Math.sin(t * 2 + s.phase) * 1.5, midY, 1.6 + heat * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── pass 4: pulse "core" highlight ───────────────────
      {
        const px = pulsePos * W;
        const grd = ctx.createRadialGradient(px, midY, 0, px, midY, W * 0.22);
        grd.addColorStop(0,   hexToRGBA(accent, 0.30 * intensity));
        grd.addColorStop(0.3, hexToRGBA(accent, 0.10 * intensity));
        grd.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);

        // a hot vertical streak right at pulse position
        const streakG = ctx.createLinearGradient(0, midY - H * 0.4, 0, midY + H * 0.4);
        streakG.addColorStop(0,   'rgba(245,232,200,0)');
        streakG.addColorStop(0.5, hexToRGBA(accent, 0.55 * intensity));
        streakG.addColorStop(1,   'rgba(245,232,200,0)');
        ctx.strokeStyle = streakG;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(px, midY - H * 0.40);
        ctx.lineTo(px, midY + H * 0.40);
        ctx.stroke();
      }

      // ── pass 5: dust ─────────────────────────────────────
      for (let i = 0; i < dust.length; i++) {
        const p = dust[i];
        p.x += p.vx;
        p.y += p.vy + Math.sin(t * 0.4 + p.seed * 6) * 0.00006;
        if (p.x > 1.05) p.x = -0.05;
        if (p.x < -0.05) p.x = 1.05;
        if (p.y > 1.05) p.y = -0.05;
        if (p.y < -0.05) p.y = 1.05;

        const px = p.x * W;
        const py = p.y * H;

        // hot if pulse is near
        const dx = p.x - pulsePos;
        const dEnv = Math.exp(-(dx * dx) / (2 * 0.12 * 0.12));
        const a = (0.18 + p.seed * 0.4) * (0.4 + breath * 0.4);
        const color = (p.seed > 0.85)
          ? `rgba(245,232,200,${a * (0.6 + dEnv * 0.6)})`
          : (dEnv > 0.25
              ? hexToRGBA(accent, a * (0.7 + dEnv * 0.9))
              : `rgba(245,245,242,${a * 0.6})`);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px, py, p.size * (0.7 + dEnv * 0.8), 0, Math.PI * 2);
        ctx.fill();
      }

      // ── pass 6: top/bottom horizon vignette ─────────────
      {
        const grd = ctx.createLinearGradient(0, 0, 0, H);
        grd.addColorStop(0,    'rgba(11,11,13,0.55)');
        grd.addColorStop(0.20, 'rgba(11,11,13,0)');
        grd.addColorStop(0.80, 'rgba(11,11,13,0)');
        grd.addColorStop(1,    'rgba(11,11,13,0.60)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    function start() { if (!rafRef.current && !reduced) rafRef.current = requestAnimationFrame(frame); }
    function stop()  { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
    function onVis() { if (document.hidden) stop(); else start(); }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    if (!reduced) start(); else frame(performance.now());

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [accent, density, reduced, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="tv-voice-column tv-voice-wall"
      aria-hidden="true"
    />
  );
}

window.VoiceWall = VoiceWall;
