/* @jsx React.createElement */
/* =========================================================
   TRUE VOICE — REMIX kinetic engine
   • scroll-reveal IntersectionObserver (non-invasive)
   • top scroll-progress bar
   • parallax for ghost watermark words
   • custom cursor dot (desktop)
   • KineticBand — full-width marquee of giant words
   ========================================================= */

const { useEffect: useKxEffect, useRef: useKxRef } = React;

/* ---------- KineticBand : marquee of huge words ---------- */
function KineticBand({ items, variant = 'dark', speed = 38, reverse = false }) {
  // items: array of { t, kind } where kind ∈ 'stroke'|'solid'|'red'|'star'
  const renderRun = (keyPrefix) =>
    items.map((it, i) => {
      if (it.kind === 'star') {
        return <span key={`${keyPrefix}-${i}`} className="kx-star" aria-hidden="true" />;
      }
      const cls =
        it.kind === 'solid' ? 'kx-word kx-word--solid' :
        it.kind === 'red'   ? 'kx-word kx-word--red'   :
                              'kx-word';
      return <span key={`${keyPrefix}-${i}`} className={cls}>{it.t}</span>;
    });

  return (
    <section className={`kx-band ${variant === 'accent' ? 'kx-band--accent' : ''}`} aria-hidden="true">
      <div
        className={`kx-marquee ${reverse ? 'kx-marquee--rev' : ''}`}
        style={{ '--kx-speed': `${speed}s` }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>{renderRun('a')}</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>{renderRun('b')}</div>
      </div>
    </section>
  );
}

/* ---------- KineticEffects : mount-once global FX ---------- */
function KineticEffects() {
  const rafRef = useKxRef(0);

  useKxEffect(() => {
    const docEl = document.documentElement;
    docEl.classList.add('tv-kinetic');

    /* ---- progress bar element ---- */
    const bar = document.createElement('div');
    bar.className = 'kx-progress';
    document.body.appendChild(bar);

    /* ---- custom cursor (desktop only) ---- */
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let cursor = null;
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let tx = cx, ty = cy;
    if (fine) {
      cursor = document.createElement('div');
      cursor.className = 'kx-cursor';
      document.body.appendChild(cursor);
      const onMove = (e) => { tx = e.clientX; ty = e.clientY; };
      const onOver = (e) => {
        const hot = e.target.closest('a, button, summary, .tv-day, .kx-band');
        cursor.classList.toggle('is-hot', !!hot);
      };
      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('mouseover', onOver, { passive: true });
      window.__kxCursorCleanup = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseover', onOver);
      };
    }

    /* ---- parallax targets ---- */
    const parallax = Array.from(document.querySelectorAll('[data-parallax]'));

    /* ---- reveal targets (scroll-sweep, jump-safe) ---- */
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let pending = [];
    if (!reduce) {
      const groups = [
        ['.tv-sh', 0], ['.tv-manifest-row', 90], ['.tv-pain-card', 90],
        ['.tv-method-card', 110], ['.tv-day', 55], ['.tv-how-step', 80],
        ['.tv-bonus-card', 110], ['.tv-outcome', 40], ['.tv-ba-col', 120],
        ['.tv-voice', 120], ['.tv-guarantee-card', 0], ['.tv-final-card', 0],
        ['.tv-faq-item', 50], ['.tv-outcome-summary', 0], ['.tv-method-axis', 0],
        ['.tv-founder-body', 0], ['.tv-founder-plate', 0],
      ];
      for (const [sel, stagger] of groups) {
        const counters = new Map();
        document.querySelectorAll(sel).forEach((n) => {
          if (n.classList.contains('kx-reveal')) return;
          n.classList.add('kx-reveal');
          const c = counters.get(n.parentElement) || 0;
          counters.set(n.parentElement, c + 1);
          if (stagger) n.style.setProperty('--kx-d', `${Math.min(c * stagger, 480)}ms`);
          pending.push(n);
        });
      }
    }
    function sweepReveal() {
      if (!pending.length) return;
      const vh = window.innerHeight;
      for (let i = pending.length - 1; i >= 0; i--) {
        const el = pending[i];
        if (el.getBoundingClientRect().top < vh * 0.9) {
          el.classList.add('kx-in');
          pending.splice(i, 1);
        }
      }
    }

    /* ---- scroll loop ---- */
    let scrollY = window.scrollY || 0;
    function onScroll() { scrollY = window.scrollY || 0; sweepReveal(); }
    sweepReveal();
    setTimeout(sweepReveal, 60);
    function loop() {
      sweepReveal();
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, scrollY / max));
      docEl.style.setProperty('--kx-p', p.toFixed(4));

      // parallax (relative to viewport center)
      const vh = window.innerHeight;
      for (const el of parallax) {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${(-center * speed).toFixed(1)}px, 0)`;
      }

      // cursor lerp
      if (cursor) {
        cx += (tx - cx) * 0.22;
        cy += (ty - cy) * 0.22;
        cursor.style.transform = `translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px) translate(-50%,-50%)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      if (window.__kxCursorCleanup) window.__kxCursorCleanup();
      bar.remove();
      if (cursor) cursor.remove();
    };
  }, []);

  return null;
}

Object.assign(window, { KineticBand, KineticEffects });
