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

    const idleWarp = reduce ? 0 : 0.022;
    let raf = 0;

    function frame() {
      ctx.clearRect(0, 0, W, H);
      vel *= 0.94;
      const warp = idleWarp + Math.min(0.085, vel * 0.0016 * intensity);

      for (let i = 0; i < stars.length; i++) {
        const st = stars[i];
        st.pr = st.r;
        st.r += warp * (0.25 + st.z);
        st.tw += 0.045;
        if (st.r >= 1.18) { Object.assign(st, makeStar(true)); continue; }

        const ca = Math.cos(st.ang), sa = Math.sin(st.ang);
        const dist  = st.r * st.r * diag;
        const pdist = st.pr * st.pr * diag;
        const x  = cx + ca * dist,  y  = cy + sa * dist;
        const px = cx + ca * pdist, py = cy + sa * pdist;

        const tw = 0.62 + 0.38 * Math.sin(st.tw);
        const eased = st.r * st.r;
        const a = Math.min(0.8, (0.1 + eased * 0.78) * tw);
        const col = st.accent
          ? 'rgba(' + ar + ',' + ag + ',' + ab + ',' + a + ')'
          : 'rgba(245,245,242,' + a + ')';

        const streak = Math.hypot(x - px, y - py);
        if (streak > 1.3) {
          ctx.strokeStyle = col;
          ctx.lineWidth = Math.max(0.5, eased * 1.9);
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
        } else {
          ctx.fillStyle = col;
          const sz = Math.max(0.5, eased * 1.5 + 0.4);
          ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
        }
      }
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
