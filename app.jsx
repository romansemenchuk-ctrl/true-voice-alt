/* @jsx React.createElement */
/* =========================================================
   TRUE VOICE — App entry
   Композиція секцій + popup + sticky bar + Tweaks panel
   ========================================================= */

const { useState: useAppState, useEffect: useAppEffect, useCallback: useAppCb } = React;

/* ── Tweaks defaults — host persists this back to disk ── */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#C8102E",
  "motion": "wall",
  "showSticky": true,
  "showSacredRing": true,
  "showSpine": true,
  "showDrift": true,
  "headlineLang": "uk"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = window.useTweaks
    ? window.useTweaks(TWEAK_DEFAULTS)
    : [TWEAK_DEFAULTS, () => {}];

  const [popupOpen, setPopupOpen] = useAppState(false);
  const openPopup  = useAppCb(() => setPopupOpen(true), []);
  const closePopup = useAppCb(() => setPopupOpen(false), []);

  // Apply runtime tokens
  useAppEffect(() => {
    document.documentElement.style.setProperty('--tv-accent', t.accent);
    document.documentElement.style.setProperty('--tv-accent-glow', hexToGlow(t.accent, 0.42));
    document.documentElement.style.setProperty('--tv-accent-soft', hexToGlow(t.accent, 0.16));
    document.documentElement.dataset.sacred = t.showSacredRing !== false ? 'on' : 'off';
  }, [t.accent, t.showSacredRing]);

  return (
    <>
      {window.VoiceAmbient
        ? <window.VoiceAmbient accent={t.accent} spine={t.showSpine !== false} drift={t.showDrift !== false}/>
        : null}
      <window.Nav onApply={openPopup}/>
      <window.Hero onApply={openPopup} motion={t.motion}/>
      <window.Manifest/>
      <window.Pains/>
      <window.Method/>
      <window.Founder/>
      <window.Program/>
      <window.HowItWorks onApply={openPopup}/>
      <window.Bonuses/>
      <window.Outcomes/>
      <window.BeforeAfter/>
      <window.Voices/>
      <window.Guarantee/>
      <window.FinalCTA onApply={openPopup}/>
      <window.FAQ/>
      <window.Footer/>

      {t.showSticky !== false ? <window.StickyBar onApply={openPopup}/> : null}
      <window.Popup open={popupOpen} onClose={closePopup}/>

      <TVTweaks tweaks={t} setTweak={setTweak}/>
    </>
  );
}

function hexToGlow(hex, a) {
  if (!hex || hex[0] !== '#') return `rgba(200,16,46,${a})`;
  const h = hex.replace('#', '');
  const r = parseInt(h.length === 3 ? h[0]+h[0] : h.slice(0,2), 16);
  const g = parseInt(h.length === 3 ? h[1]+h[1] : h.slice(2,4), 16);
  const b = parseInt(h.length === 3 ? h[2]+h[2] : h.slice(4,6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function TVTweaks({ tweaks, setTweak }) {
  if (!window.TweaksPanel) return null;
  const { TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakToggle } = window;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Сигнальний колір">
        <TweakColor
          label="Акцент"
          value={tweaks.accent}
          onChange={(v) => setTweak('accent', v)}
          options={['#C8102E', '#DC143C', '#C9A227', '#EF4444']}
        />
      </TweakSection>
      <TweakSection title="Hero-анімація">
        <TweakRadio
          label="Стиль"
          value={tweaks.motion}
          onChange={(v) => setTweak('motion', v)}
          options={[
            { value: 'wall',      label: 'Wall' },
            { value: 'cinematic', label: 'Column' },
            { value: 'calm',      label: 'Calm' },
            { value: 'off',       label: 'Off' },
          ]}
        />
        <TweakToggle
          label="Сакральне кільце"
          value={tweaks.showSacredRing}
          onChange={(v) => setTweak('showSacredRing', v)}
        />
      </TweakSection>
      <TweakSection title="Атмосфера сайту">
        <TweakToggle
          label="Voice spine (правий край)"
          value={tweaks.showSpine !== false}
          onChange={(v) => setTweak('showSpine', v)}
        />
        <TweakToggle
          label="Color drift (фонові плями)"
          value={tweaks.showDrift !== false}
          onChange={(v) => setTweak('showDrift', v)}
        />
      </TweakSection>
      <TweakSection title="Конверсія">
        <TweakToggle
          label="Sticky-бар (mobile)"
          value={tweaks.showSticky}
          onChange={(v) => setTweak('showSticky', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
