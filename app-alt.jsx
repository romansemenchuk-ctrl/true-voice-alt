/* @jsx React.createElement */
/* =========================================================
   TRUE VOICE — ALT app entry
   Refined-evolution page. New centered HeroAlt built around
   ResonanceField. Reuses all original sections + copy.
   ========================================================= */

const { useState: useAltState, useEffect: useAltEffect, useRef: useAltRef, useCallback: useAltCb } = React;

const ALT_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#E60012",
  "fieldEnergy": "calm",
  "showSticky": true,
  "showSpine": true,
  "showDrift": true,
  "showBands": true,
  "showCosmos": true
}/*EDITMODE-END*/;

function altGlow(hex, a) {
  if (!hex || hex[0] !== '#') return `rgba(230,0,18,${a})`;
  const h = hex.replace('#', '');
  const r = parseInt(h.length === 3 ? h[0]+h[0] : h.slice(0,2), 16);
  const g = parseInt(h.length === 3 ? h[1]+h[1] : h.slice(2,4), 16);
  const b = parseInt(h.length === 3 ? h[2]+h[2] : h.slice(4,6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/* ---------- HERO (alt) — centered broadcast ---------- */
function HeroAlt({ onApply, accent = '#E60012', energy = 'calm' }) {
  const innerRef = useAltRef(null);
  const fieldRef = useAltRef(null);
  const label = (window.startDateLabel ? window.startDateLabel() : '');
  const intensity = energy === 'intense' ? 1.35 : energy === 'off' ? 0 : 1;
  const reduced = energy === 'off';

  // cinematic scroll-dissolve: hero content lifts + fades, field scales
  useAltEffect(() => {
    if (reduced) return;
    let raf = 0, sy = 0;
    function tick() {
      const vh = window.innerHeight;
      const k = Math.min(1, sy / (vh * 0.9));
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(0, ${(-k * 60).toFixed(1)}px, 0)`;
        innerRef.current.style.opacity = (1 - k * 1.1).toFixed(3);
      }
      if (fieldRef.current) {
        fieldRef.current.style.transform = `scale(${(1 + k * 0.12).toFixed(4)})`;
        fieldRef.current.style.opacity = (1 - k * 0.6).toFixed(3);
      }
      raf = 0;
    }
    function onScroll() { sy = window.scrollY || 0; if (!raf) raf = requestAnimationFrame(tick); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [reduced]);

  return (
    <section className="av-hero" id="top">
      <div className="av-hero-field" ref={fieldRef}>
        {window.ResonanceField
          ? <window.ResonanceField accent={accent} intensity={intensity} reduced={reduced} />
          : null}
      </div>

      <span className="av-corner av-corner--tl" aria-hidden="true" />
      <span className="av-corner av-corner--tr" aria-hidden="true" />
      <span className="av-corner av-corner--bl" aria-hidden="true" />
      <span className="av-corner av-corner--br" aria-hidden="true" />

      <div className="av-hero-inner" ref={innerRef}>
        <div className="av-meta av-rise" style={{ '--d': '60ms' }}>
          <span className="av-pill">Онлайн-курс · Голос, що підкоряє</span>
          <span className="av-pill av-pill--accent"><span className="dot" />Старт {label}</span>
        </div>

        <h1 className="av-wordmark" aria-label="TRUE VOICE">
          <span className="w1">TRUE</span>
          <span className="w2">VOICE</span>
        </h1>

        <p className="av-headline av-rise" style={{ '--d': '460ms' }}>
          Перестань <span className="ital">втрачати</span> голос перед виступом —{' '}
          <span className="accent">7 днів до живого звучання.</span>
        </p>

        <p className="av-sub av-rise" style={{ '--d': '560ms' }}>
          7 практик по 15–20 хвилин через Telegram-бот відновлюють дихання,
          розслабляють тіло і повертають голосу природну силу.
        </p>

        <div className="av-offer av-rise" style={{ '--d': '660ms' }}>
          <span className="av-price">
            <span className="old">100&nbsp;$</span>
            <span className="arr">→</span>
            <span className="new">15&nbsp;$</span>
            <span className="til">7 місяців<br />доступу</span>
            <span className="av-save" aria-label="Знижка 85 відсотків">
              <span className="pct">−85%</span>
              <span className="lbl">вигода&nbsp;85&nbsp;$</span>
            </span>
          </span>
          <button className="av-cta" onClick={onApply}>
            Забрати від&nbsp;15$ <span className="arrow">→</span>
          </button>
        </div>

        <div className="av-trust av-rise" style={{ '--d': '760ms' }}>
          <span className="stars">★★★★★</span>
          <span>Віктор Терент’єв, бізнес-коуч — <em>«голос став нижчим і теплішим вже на 3–4 день»</em></span>
        </div>

        <ul className="av-bullets av-rise" style={{ '--d': '860ms' }}>
          <li><span className="b" />Перші зміни <strong>після першої практики</strong></li>
          <li><span className="b" />Без музичної освіти і теорії</li>
          <li><span className="b" />30+ років сцени · 1000+ концертів</li>
        </ul>
      </div>

      <div className="av-scrollcue av-rise" style={{ '--d': '1100ms' }} aria-hidden="true">
        <span>Слухай далі</span>
        <span className="track" />
      </div>
    </section>
  );
}

/* ---------- kinetic band content (reused dividers) ---------- */
const ALT_BAND_1 = [
  { t: 'Дихай', kind: 'stroke' }, { kind: 'star' },
  { t: 'Звучи', kind: 'red' },    { kind: 'star' },
  { t: 'Відчуй', kind: 'stroke' },{ kind: 'star' },
  { t: 'Повернись', kind: 'solid' }, { kind: 'star' },
];
const ALT_BAND_2 = [
  { t: '7 днів', kind: 'red' },        { kind: 'star' },
  { t: '7 практик', kind: 'stroke' },  { kind: 'star' },
  { t: 'Одне повернення', kind: 'solid' }, { kind: 'star' },
];
const ALT_BAND_3 = [
  { t: 'Живий голос', kind: 'solid' }, { kind: 'star' },
  { t: 'True Voice', kind: 'solid' },  { kind: 'star' },
  { t: 'Усе в тобі', kind: 'solid' },  { kind: 'star' },
];

function App() {
  const [t, setTweak] = window.useTweaks ? window.useTweaks(ALT_DEFAULTS) : [ALT_DEFAULTS, () => {}];
  const [popupOpen, setPopupOpen] = useAltState(false);
  const openPopup = useAltCb(() => setPopupOpen(true), []);
  const closePopup = useAltCb(() => setPopupOpen(false), []);

  useAltEffect(() => {
    const el = document.documentElement;
    el.style.setProperty('--tv-accent', t.accent);
    el.style.setProperty('--accent', t.accent);
    el.style.setProperty('--tv-accent-glow', altGlow(t.accent, 0.55));
    el.style.setProperty('--accent-glow', altGlow(t.accent, 0.55));
    el.style.setProperty('--tv-accent-soft', altGlow(t.accent, 0.16));
  }, [t.accent]);

  // intro veil fade
  useAltEffect(() => {
    const v = document.getElementById('av-veil');
    if (v) { requestAnimationFrame(() => v.classList.add('gone')); setTimeout(() => v.remove(), 1100); }
  }, []);

  const W = window;
  return (
    <>
      {W.VoiceAmbient ? <W.VoiceAmbient accent={t.accent} spine={t.showSpine !== false} drift={t.showDrift !== false} /> : null}
      {W.CosmosField && t.showCosmos !== false ? <W.CosmosField accent={t.accent} /> : null}
      <W.Nav onApply={openPopup} />
      <HeroAlt onApply={openPopup} accent={t.accent} energy={t.fieldEnergy} />

      {t.showBands !== false ? <W.KineticBand items={ALT_BAND_1} variant="dark" speed={38} /> : null}
      <W.Manifest />
      <W.Pains />

      <W.Method />
      <W.Founder />
      <W.Program />

      {t.showBands !== false ? <W.KineticBand items={ALT_BAND_2} variant="dark" speed={34} reverse /> : null}
      <W.HowItWorks onApply={openPopup} />
      <W.Bonuses />
      <W.Outcomes />
      <W.BeforeAfter />
      <W.Voices />
      <W.Guarantee />

      {t.showBands !== false ? <W.KineticBand items={ALT_BAND_3} variant="accent" speed={30} reverse /> : null}
      <W.FinalCTA onApply={openPopup} />
      <W.FAQ />
      <W.Footer />

      {t.showSticky !== false ? <W.StickyBar onApply={openPopup} /> : null}
      <W.Popup open={popupOpen} onClose={closePopup} />

      {W.KineticEffects ? <W.KineticEffects /> : null}
      <AltTweaks tweaks={t} setTweak={setTweak} />
    </>
  );
}

function AltTweaks({ tweaks, setTweak }) {
  if (!window.TweaksPanel) return null;
  const { TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakToggle } = window;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Сигнальний колір">
        <TweakColor
          label="Акцент"
          value={tweaks.accent}
          onChange={(v) => setTweak('accent', v)}
          options={['#E60012', '#FF2A1A', '#C8102E', '#FF4D00']}
        />
      </TweakSection>
      <TweakSection label="Резонансне поле">
        <TweakRadio
          label="Енергія"
          value={tweaks.fieldEnergy}
          onChange={(v) => setTweak('fieldEnergy', v)}
          options={[
            { value: 'calm', label: 'Спокій' },
            { value: 'intense', label: 'Сила' },
            { value: 'off', label: 'Off' },
          ]}
        />
      </TweakSection>
      <TweakSection label="Атмосфера">
        <TweakToggle label="Космос · гіпер-простір" value={tweaks.showCosmos !== false} onChange={(v) => setTweak('showCosmos', v)} />
        <TweakToggle label="Кінетичні смуги" value={tweaks.showBands !== false} onChange={(v) => setTweak('showBands', v)} />
        <TweakToggle label="Spine (правий край)" value={tweaks.showSpine !== false} onChange={(v) => setTweak('showSpine', v)} />
        <TweakToggle label="Color drift" value={tweaks.showDrift !== false} onChange={(v) => setTweak('showDrift', v)} />
      </TweakSection>
      <TweakSection label="Конверсія">
        <TweakToggle label="Sticky-бар" value={tweaks.showSticky !== false} onChange={(v) => setTweak('showSticky', v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

document.documentElement.classList.add('av-page');
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
