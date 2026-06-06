/* @jsx React.createElement */
/* =========================================================
   CosmosField — фіксований зорепад + гіпер-простір.
   Зірки повільно дрейфують назовні з точки сходу (calm),
   а під час скролу розганяються у світлові смуги (warp).
   Малюється у fixed-шарі позаду всього сайту (z-index 0),
   видно крізь напівпрозорі секції.
   ========================================================= */

const { useEffect: useCosmosEff, useRef: useCosmosRef } = React;

function CosmosField({ accent = '#C8102E', enabled = true, intensity = 1 }) {
  const canvasRef = useCosmosRef(null);

  useCosmosEff(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0, H = 0, DPR = 1, cx = 0, cy = 0, diag = 1;
    let stars = [];

    function rgb(hex) {
      const h = hex.replace('#', '');
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
    let [ar, ag, ab] = rgb(accent);

    function makeStar(nearCenter) {
      return {
        ang: Math.random() * Math.PI * 2,
        r:  nearCenter ? Math.random() * 0.16 : Math.random(),
        pr: 0,
        z:  0.2 + Math.random() * 0.8,     // depth → speed
        tw: Math.random() * Math.PI * 2,   // twinkle phase
        accent: Math.random() < 0.13,      // a few blood-red stars
        trail: 0,                          // persistent streak length (px) — frozen when idle
      };
    }

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      cx = W * 0.5; cy = H * 0.42;
      diag = Math.hypot(W, H) * 0.58;
      const target = Math.round(Math.min(540, (W * H) / 3200));
      if (stars.length < target) { while (stars.length < target) stars.push(makeStar(false)); }
      else stars.length = target;
    }

    let lastScroll = window.scrollY || 0;
    let vel = 0;
    function onScroll() {
      const s = window.scrollY || 0;
      vel += Math.abs(s - lastScroll);
      lastScroll = s;
    }

    // ── heartbeat ripple — concentric red waves from centre ──
    // lub-dub at ~62 BPM. Each beat expands & fades into the
    // background but the rhythm keeps emitting → never gone.
    const beats = [];
    let lastLub = -10;
    const BEAT_PERIOD = 60 / 62;

    function drawHeartbeat(t) {
      if (t - lastLub >= BEAT_PERIOD) {
        lastLub = t;
        beats.push({ born: t,        s: 1.0 });  // lub
        beats.push({ born: t + 0.17, s: 0.5 });  // dub
      }
      const reach = Math.max(W, H) * 0.78;
      for (let i = beats.length - 1; i >= 0; i--) {
        const b = beats[i];
        const age = t - b.born;
        if (age < 0) continue;
        const life = 2.8;
        if (age > life) { beats.splice(i, 1); continue; }
        const e = age / life;
        const r = e * reach;
        const a = (1 - e) * (1 - e) * 0.14 * b.s;   // recedes into the background
        if (a < 0.004) continue;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.9, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(' + ar + ',' + ag + ',' + ab + ',' + a + ')';
        ctx.lineWidth = (1 - e) * 2.2 + 0.4;
        ctx.stroke();
      }
      // soft central flash on the lub
      const since = t - lastLub;
      const glow = Math.exp(-since * 5) * 0.11;
      if (glow > 0.004) {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, reach * 0.5);
        g.addColorStop(0, 'rgba(' + ar + ',' + ag + ',' + ab + ',' + glow + ')');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
    }

    let raf = 0;

    function frame(ts) {
      const t = (ts || performance.now()) * 0.001;
      ctx.clearRect(0, 0, W, H);
      vel *= 0.9;

      // warp is driven by SCROLL only — no idle drift, no pulse
      const warp = Math.min(0.085, vel * 0.0016 * intensity);
      const moving = warp > 0.0009;

      for (let i = 0; i < stars.length; i++) {
        const st = stars[i];
        const adv = warp * (0.25 + st.z);
        st.pr = st.r;
        st.r += adv;
        if (moving) st.tw += 0.05;               // twinkle only while travelling
        if (st.r >= 1.18) { Object.assign(st, makeStar(true)); continue; }

        const ca = Math.cos(st.ang), sa = Math.sin(st.ang);
        const dist  = st.r * st.r * diag;
        const pdist = st.pr * st.pr * diag;

        // trail persistence: grows with motion; while decelerating it
        // eases toward the slower speed; once you STOP it freezes → the
        // streaks stay on screen instead of collapsing to dots.
        const move = dist - pdist;
        if (move > st.trail) st.trail = move;
        else if (moving) st.trail *= 0.86;
        if (st.trail > 110) st.trail = 110;

        const x  = cx + ca * dist, y = cy + sa * dist;
        const tx = cx + ca * (dist - st.trail), ty = cy + sa * (dist - st.trail);

        const tw = 0.62 + 0.38 * Math.sin(st.tw);
        const eased = st.r * st.r;
        const a = Math.min(0.8, (0.1 + eased * 0.78) * tw);
        const col = st.accent
          ? 'rgba(' + ar + ',' + ag + ',' + ab + ',' + a + ')'
          : 'rgba(245,245,242,' + a + ')';

        if (st.trail > 1.3) {
          ctx.strokeStyle = col;
          ctx.lineWidth = Math.max(0.5, eased * 1.9);
          ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke();
        } else {
          ctx.fillStyle = col;
          const sz = Math.max(0.5, eased * 1.5 + 0.4);
          ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
        }
      }

      if (!reduce) drawHeartbeat(t);

      raf = requestAnimationFrame(frame);
    }

    function start() { if (!raf) raf = requestAnimationFrame(frame); }
    function stop()  { cancelAnimationFrame(raf); raf = 0; }
    function onVis() { if (document.hidden) stop(); else start(); }

    resize();
    onScroll();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    start();

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [accent, enabled, intensity]);

  if (!enabled) return null;
  return (
    <div className="cosmos-layer" aria-hidden="true">
      <canvas ref={canvasRef} className="cosmos-canvas" />
    </div>
  );
}

window.CosmosField = CosmosField;
