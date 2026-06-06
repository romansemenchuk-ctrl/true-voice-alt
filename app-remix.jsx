/* @jsx React.createElement */
/* =========================================================
   TRUE VOICE — REMIX app entry
   Same sections, same copy — moodboard kinetic skin.
   New HeroRemix + KineticBand interludes + global FX.
   ========================================================= */

const { useState: useRxState, useEffect: useRxEffect, useCallback: useRxCb } = React;

const RX_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#E60012",
  "motion": "wall",
  "showSticky": true,
  "showSacredRing": false,
  "showSpine": true,
  "showDrift": true
}/*EDITMODE-END*/;

function rxGlow(hex, a) {
  if (!hex || hex[0] !== '#') return `rgba(230,0,18,${a})`;
  const h = hex.replace('#', '');
  const r = parseInt(h.length === 3 ? h[0]+h[0] : h.slice(0,2), 16);
  const g = parseInt(h.length === 3 ? h[1]+h[1] : h.slice(2,4), 16);
  const b = parseInt(h.length === 3 ? h[2]+h[2] : h.slice(4,6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/* ---------- HERO (remix) — preserves all original text ---------- */
function HeroRemix({ onApply, motion = 'wall', accent = '#E60012' }) {
  const reduced = motion === 'off';
  const density = motion === 'wall' ? 1 : 0.6;
  const label = (window.startDateLabel ? window.startDateLabel() : '');

  return (
    <section className="tv-hero" id="top">
      {/* moving canvas field */}
      <div className="tv-hero-stage" data-parallax="0.12" aria-hidden="true">
        {motion === 'wall' && window.VoiceWall
          ? <window.VoiceWall accent={accent} density={density} reduced={reduced} intensity={1.15} />
          : window.VoiceColumn
            ? <window.VoiceColumn accent={accent} density={density} reduced={reduced} />
            : null}
        <div className="tv-hero-horizon" />
      </div>

      {/* giant parallax watermark */}
      <div className="hx-ghost" data-parallax="0.22" aria-hidden="true">ГОЛОС</div>

      <div className="tv-hero-inner">
        <div className="tv-hero-meta tv-reveal">
          <span className="tv-pill">Онлайн-курс від Романа Семенчука</span>
          <span className="tv-pill tv-pill--accent"><span className="dot" />Старт {label}</span>
        </div>

        <div className="tv-hero-wordmark tv-reveal" style={{ animationDelay: '80ms' }} aria-label="TRUE VOICE">
          <span className="t1">TRUE</span>
          <span className="t2">VOICE</span>
        </div>

        <h1 className="tv-hero-headline tv-reveal" style={{ animationDelay: '160ms' }}>
          Перестань <span className="ital">втрачати</span> голос перед виступом —{' '}
          <span className="tv-hero-accent">7 днів до живого звучання<span className="dot" style={{ color: 'var(--tv-accent)' }}>.</span></span>
        </h1>

        <p className="tv-hero-sub tv-reveal" style={{ animationDelay: '240ms' }}>
          7 практик по 20–30 хвилин через Telegram-бот відновлюють дихання, розслабляють тіло і повертають голосу природну силу.
        </p>

        <div className="tv-hero-price tv-reveal" style={{ animationDelay: '300ms' }}>
          <span className="old">45&nbsp;$</span>
          <span className="arr">→</span>
          <span className="new">15&nbsp;$</span>
          <span className="til">7 місяців доступу</span>
        </div>

        <div className="tv-hero-ctas tv-reveal" style={{ animationDelay: '360ms' }}>
          <button className="tv-btn tv-btn--big" onClick={onApply}>
            Забрати від&nbsp;15$ <span className="arrow">→</span>
          </button>
          <span className="tv-hero-trust">
            <span className="tv-hero-trust-mark" style={{ color: 'var(--tv-accent)' }}>★★★★★</span>
            Віктор Терент’єв, бізнес-коуч —<br className="tv-hide-narrow" />
            <em>«На 3–4 день почала відпускати щелепа, голос став нижчим і теплішим».</em>
          </span>
        </div>

        <ul className="tv-hero-bullets tv-reveal" style={{ animationDelay: '440ms' }}>
          <li><span className="b" />Перші зміни <strong>після першої практики</strong></li>
          <li><span className="b" />Без музичної освіти і складної теорії</li>
          <li><span className="b" />30+ років сценічного досвіду · 1000+ концертів</li>
        </ul>
      </div>

      <div className="tv-hero-tape" aria-hidden="true">
        <span>TC · 00:00:18</span><span>·</span>
        <span>VOX · 432 Hz</span><span>·</span>
        <span>ƒ 2.0</span><span>·</span>
        <span className="dot" /><span>REC</span>
      </div>
    </section>
  );
}

/* ---------- band content (thematic kinetic dividers) ---------- */
const BAND_1 = [
  { t: 'Дихай', kind: 'stroke' }, { kind: 'star' },
  { t: 'Звучи', kind: 'red' },    { kind: 'star' },
  { t: 'Відчуй', kind: 'stroke' },{ kind: 'star' },
  { t: 'Повернись', kind: 'solid' }, { kind: 'star' },
];
const BAND_2 = [
  { t: 'Тіло', kind: 'solid' },     { kind: 'star' },
  { t: 'Нерви', kind: 'stroke' },   { kind: 'star' },
  { t: 'Звук', kind: 'red' },       { kind: 'star' },
  { t: 'Резонанс', kind: 'stroke' },{ kind: 'star' },
];
const BAND_3 = [
  { t: '7 днів', kind: 'red' },        { kind: 'star' },
  { t: '7 практик', kind: 'stroke' },  { kind: 'star' },
  { t: 'Одне повернення', kind: 'solid' }, { kind: 'star' },
];
const BAND_4 = [
  { t: 'Живий голос', kind: 'solid' }, { kind: 'star' },
  { t: 'True Voice', kind: 'solid' },  { kind: 'star' },
  { t: 'Усе в тобі', kind: 'solid' },  { kind: 'star' },
];

function App() {
  const [t, setTweak] = window.useTweaks ? window.useTweaks(RX_DEFAULTS) : [RX_DEFAULTS, () => {}];
  const [popupOpen, setPopupOpen] = useRxState(false);
  const openPopup = useRxCb(() => setPopupOpen(true), []);
  const closePopup = useRxCb(() => setPopupOpen(false), []);

  useRxEffect(() => {
    const el = document.documentElement;
    el.style.setProperty('--tv-accent', t.accent);
    el.style.setProperty('--accent', t.accent);
    el.style.setProperty('--tv-accent-glow', rxGlow(t.accent, 0.55));
    el.style.setProperty('--accent-glow', rxGlow(t.accent, 0.55));
    el.style.setProperty('--tv-accent-soft', rxGlow(t.accent, 0.16));
    el.dataset.sacred = t.showSacredRing ? 'on' : 'off';
  }, [t.accent, t.showSacredRing]);

  const W = window;
  return (
    <>
      {W.VoiceAmbient ? <W.VoiceAmbient accent={t.accent} spine={t.showSpine !== false} drift={t.showDrift !== false} /> : null}
      <W.Nav onApply={openPopup} />
      <HeroRemix onApply={openPopup} motion={t.motion} accent={t.accent} />

      <W.KineticBand items={BAND_1} variant="dark" speed={36} />
      <W.Manifest />
      <W.Pains />

      <W.KineticBand items={BAND_2} variant="dark" speed={42} reverse />
      <W.Method />
      <W.Founder />
      <W.Program />

      <W.KineticBand items={BAND_3} variant="dark" speed={34} />
      <W.HowItWorks onApply={openPopup} />
      <W.Bonuses />
      <W.Outcomes />
      <W.BeforeAfter />
      <W.Voices />
      <W.Guarantee />

      <W.KineticBand items={BAND_4} variant="accent" speed={30} reverse />
      <W.FinalCTA onApply={openPopup} />
      <W.FAQ />
      <W.Footer />

      {t.showSticky !== false ? <W.StickyBar onApply={openPopup} /> : null}
      <W.Popup open={popupOpen} onClose={closePopup} />

      {W.KineticEffects ? <W.KineticEffects /> : null}
      <RxTweaks tweaks={t} setTweak={setTweak} />
    </>
  );
}

function RxTweaks({ tweaks, setTweak }) {
  if (!window.TweaksPanel) return null;
  const { TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakToggle } = window;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Сигнальний колір">
        <TweakColor
          label="Акцент"
          value={tweaks.accent}
          onChange={(v) => setTweak('accent', v)}
          options={['#E60012', '#FF2A1A', '#C8102E', '#FF4D00']}
        />
      </TweakSection>
      <TweakSection title="Hero-рух">
        <TweakRadio
          label="Поле"
          value={tweaks.motion}
          onChange={(v) => setTweak('motion', v)}
          options={[
            { value: 'wall', label: 'Wall' },
            { value: 'cinematic', label: 'Column' },
            { value: 'off', label: 'Off' },
          ]}
        />
        <TweakToggle label="Сакральне кільце" value={tweaks.showSacredRing} onChange={(v) => setTweak('showSacredRing', v)} />
      </TweakSection>
      <TweakSection title="Атмосфера">
        <TweakToggle label="Spine (правий край)" value={tweaks.showSpine !== false} onChange={(v) => setTweak('showSpine', v)} />
        <TweakToggle label="Color drift" value={tweaks.showDrift !== false} onChange={(v) => setTweak('showDrift', v)} />
      </TweakSection>
      <TweakSection title="Конверсія">
        <TweakToggle label="Sticky-бар" value={tweaks.showSticky} onChange={(v) => setTweak('showSticky', v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
