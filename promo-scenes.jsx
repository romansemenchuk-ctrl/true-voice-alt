/* @jsx React.createElement */
/* =========================================================
   TRUE VOICE — promo video scenes
   ~19s cinematic teaser over the PromoField. Pure black /
   blood red / air. Oswald (display) + Manrope (body).
   Driven entirely by the Stage timeline.
   ========================================================= */

const { useTime: pUseTime } = window;

const DISP = "'Oswald','Arial Narrow',sans-serif";
const BODY = "'Manrope','Inter',system-ui,sans-serif";
const ACCENT = '#E60012';
const AIR = '#F6F4F0';

const pClamp = (v, a, b) => Math.max(a, Math.min(b, v));
function env(t, s, inDur, holdEnd, outDur) {
  // returns 0..1 envelope: fade in from s over inDur, hold until holdEnd, fade out over outDur
  if (t < s) return 0;
  if (t < s + inDur) return pClamp((t - s) / inDur, 0, 1);
  if (t < holdEnd) return 1;
  if (t < holdEnd + outDur) return 1 - pClamp((t - holdEnd) / outDur, 0, 1);
  return 0;
}
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

/* ---------- generic timed layer ---------- */
function Layer({ t, s, inDur = 0.5, holdEnd, outDur = 0.4, y = 0, rise = 28, children, style }) {
  const e = env(t, s, inDur, holdEnd, outDur);
  if (e <= 0.001) return null;
  const appearing = t < s + inDur;
  const k = appearing ? easeOut(pClamp((t - s) / inDur, 0, 1)) : 1;
  const ty = y + (1 - k) * rise;
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, textAlign: 'center',
      opacity: e, transform: `translateY(${ty}px)`, willChange: 'transform,opacity',
      ...style,
    }}>{children}</div>
  );
}

/* ---------- overline pill ---------- */
function Pill({ children, accent }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      fontFamily: BODY, fontSize: 19, fontWeight: 600, letterSpacing: '0.26em',
      textTransform: 'uppercase', color: accent ? AIR : 'rgba(176,174,168,1)',
      whiteSpace: 'nowrap', padding: '12px 22px', border: `1px solid ${accent ? 'rgba(230,0,18,0.55)' : 'rgba(246,244,240,0.2)'}`,
      background: 'rgba(8,8,10,0.5)',
    }}>{children}</span>
  );
}

/* ---------- SCENE 1 — ignition caption ---------- */
function S1({ t }) {
  return (
    <Layer t={t} s={0.7} inDur={0.7} holdEnd={2.4} outDur={0.5} style={{ top: 482 }}>
      <div style={{ fontFamily: BODY, fontSize: 30, fontWeight: 500, letterSpacing: '0.04em', color: 'rgba(176,174,168,1)' }}>
        тіло і голос — <span style={{ color: AIR, fontStyle: 'italic' }}>єдина система</span>
      </div>
      <div style={{
        margin: '26px auto 0', width: 1, height: 54,
        background: 'linear-gradient(180deg, rgba(246,244,240,0.4), transparent)',
      }} />
    </Layer>
  );
}

/* ---------- SCENE 2 — wordmark ---------- */
function WordMask({ word, color, stroke, delay, t, s }) {
  const local = t - s - delay;
  const k = easeOut(pClamp(local / 0.7, 0, 1));
  const ty = (1 - k) * 100;
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', lineHeight: 0.8, padding: '0 0.04em' }}>
      <span style={{
        display: 'inline-block', transform: `translateY(${ty}%)`,
        color: stroke ? 'transparent' : color,
        WebkitTextStroke: stroke ? `2.6px ${AIR}` : '0',
        textShadow: stroke ? 'none' : `0 0 90px rgba(230,0,18,0.55)`,
      }}>{word}</span>
    </span>
  );
}
function S2({ t }) {
  const s = 3.0;
  const pillE = env(t, s + 0.1, 0.5, 6.4, 0.45);
  const tagE = env(t, s + 1.3, 0.6, 6.4, 0.45);
  const wmOut = env(t, s, 0.01, 6.4, 0.5); // fades whole block out at end
  if (t < s - 0.1 || wmOut <= 0) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: t > 6.4 ? wmOut : 1 }}>
      <div style={{ position: 'absolute', top: 300, left: 0, right: 0, textAlign: 'center', opacity: pillE,
        transform: `translateY(${(1 - pillE) * 18}px)` }}>
        <Pill>Онлайн-курс · Роман Семенчук</Pill>
      </div>
      <div style={{
        position: 'absolute', top: 392, left: 0, right: 0, textAlign: 'center',
        fontFamily: DISP, fontWeight: 700, fontSize: 250, lineHeight: 0.8,
        letterSpacing: '-0.012em', textTransform: 'uppercase',
        display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 28,
      }}>
        <WordMask word="TRUE" stroke delay={0.0} t={t} s={s} />
        <WordMask word="VOICE" color={ACCENT} delay={0.18} t={t} s={s} />
      </div>
      <div style={{ position: 'absolute', top: 712, left: 0, right: 0, textAlign: 'center', opacity: tagE,
        transform: `translateY(${(1 - tagE) * 18}px)` }}>
        <span style={{ fontFamily: DISP, fontWeight: 600, fontSize: 46, letterSpacing: '0.02em',
          textTransform: 'uppercase', color: AIR }}>
          7 днів до живого звучання<span style={{ color: ACCENT }}>.</span>
        </span>
      </div>
    </div>
  );
}

/* ---------- SCENE 3 — problem → promise ---------- */
function S3({ t }) {
  const s = 7.0;
  // problem line 7.0 - 8.7
  const probE = env(t, s, 0.5, 8.4, 0.4);
  const strike = pClamp((t - (s + 0.9)) / 0.5, 0, 1);
  // promise 8.7 - 10.9
  const ps = 8.75;
  const promE = env(t, ps, 0.5, 10.5, 0.45);
  const promK = easeOutBack(pClamp((t - ps) / 0.7, 0, 1));
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {probE > 0.001 && (
        <div style={{ position: 'absolute', top: 470, left: 0, right: 0, textAlign: 'center', opacity: probE }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ fontFamily: DISP, fontWeight: 600, fontSize: 92, lineHeight: 1.0,
              textTransform: 'uppercase', color: 'rgba(140,138,132,1)', letterSpacing: '-0.005em' }}>
              Голос, який не<br />слухається
            </span>
            <span style={{ position: 'absolute', top: '50%', left: -10, right: -10, height: 6,
              background: ACCENT, transformOrigin: 'left', transform: `scaleX(${strike})`,
              boxShadow: '0 0 24px rgba(230,0,18,0.7)' }} />
          </div>
        </div>
      )}
      {promE > 0.001 && (
        <div style={{ position: 'absolute', top: 452, left: 0, right: 0, textAlign: 'center', opacity: promE,
          transform: `scale(${0.9 + 0.1 * pClamp(promK, 0, 1.2)})` }}>
          <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 132, lineHeight: 0.94,
            textTransform: 'uppercase', color: AIR, letterSpacing: '-0.01em' }}>
            Голос, що<br /><span style={{ color: ACCENT, fontStyle: 'italic', fontWeight: 600,
              textShadow: '0 0 80px rgba(230,0,18,0.5)' }}>повертається.</span>
          </span>
        </div>
      )}
    </div>
  );
}

/* ---------- SCENE 4 — program ---------- */
function S4({ t }) {
  const s = 11.0;
  const e = env(t, s, 0.5, 13.4, 0.45);
  if (e <= 0.001) return null;
  const k = easeOut(pClamp((t - s) / 0.7, 0, 1));
  const meta = env(t, s + 0.5, 0.5, 13.4, 0.45);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: e }}>
      <div style={{ position: 'absolute', top: 372, left: 0, right: 0, textAlign: 'center',
        transform: `translateY(${(1 - k) * 30}px)` }}>
        <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 300, lineHeight: 0.78,
          textTransform: 'uppercase', color: ACCENT, letterSpacing: '-0.02em',
          textShadow: '0 0 100px rgba(230,0,18,0.4)' }}>7</span>
        <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 88, letterSpacing: '0.04em',
          textTransform: 'uppercase', color: AIR, marginTop: -6 }}>практик</div>
      </div>
      <div style={{ position: 'absolute', top: 770, left: 0, right: 0, textAlign: 'center', opacity: meta }}>
        <span style={{ fontFamily: BODY, fontSize: 24, fontWeight: 600, whiteSpace: 'nowrap',
          letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(176,174,168,1)' }}>
          20–30 хв/день<span style={{ color: ACCENT, margin: '0 18px' }}>·</span>
          Telegram-бот<span style={{ color: ACCENT, margin: '0 18px' }}>·</span>
          7 місяців доступу
        </span>
      </div>
    </div>
  );
}

/* ---------- SCENE 5 — offer ---------- */
function S5({ t }) {
  const s = 14.2;
  const e = env(t, s, 0.5, 16.4, 0.45);
  if (e <= 0.001) return null;
  const startE = env(t, s + 0.1, 0.45, 16.4, 0.45);
  const priceK = easeOutBack(pClamp((t - (s + 0.35)) / 0.7, 0, 1));
  const ctaK = easeOut(pClamp((t - (s + 0.9)) / 0.5, 0, 1));
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: e }}>
      <div style={{ position: 'absolute', top: 330, left: 0, right: 0, textAlign: 'center', opacity: startE }}>
        <Pill accent><span style={{ width: 9, height: 9, borderRadius: '50%', background: ACCENT,
          boxShadow: '0 0 12px rgba(230,0,18,0.7)' }} />Старт завтра · ціна повертається до 45 $</Pill>
      </div>
      <div style={{ position: 'absolute', top: 432, left: 0, right: 0, textAlign: 'center',
        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 36,
        transform: `scale(${0.92 + 0.08 * pClamp(priceK, 0, 1.3)})` }}>
        <span style={{ fontFamily: BODY, fontSize: 64, color: 'rgba(110,108,104,1)', textDecoration: 'line-through' }}>45&nbsp;$</span>
        <span style={{ fontFamily: DISP, fontSize: 84, color: ACCENT }}>→</span>
        <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 232, lineHeight: 0.8, color: AIR,
          whiteSpace: 'nowrap', textShadow: '0 0 80px rgba(230,0,18,0.3)' }}>15<span style={{ fontSize: 150, marginLeft: 8, verticalAlign: '0.14em' }}>$</span></span>
      </div>
      <div style={{ position: 'absolute', top: 738, left: 0, right: 0, textAlign: 'center',
        opacity: ctaK, transform: `translateY(${(1 - ctaK) * 22}px)` }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 16, background: ACCENT,
          color: AIR, fontFamily: DISP, fontWeight: 600, fontSize: 40, letterSpacing: '0.12em',
          textTransform: 'uppercase', whiteSpace: 'nowrap', padding: '26px 50px', boxShadow: '0 0 60px rgba(230,0,18,0.45)' }}>
          Забрати від 15$ <span>→</span>
        </span>
        <div style={{ marginTop: 26, fontFamily: BODY, fontSize: 22, color: 'rgba(176,174,168,1)' }}>
          14 днів гарантії повернення
        </div>
      </div>
    </div>
  );
}

/* ---------- SCENE 6 — sign-off ---------- */
function S6({ t }) {
  const s = 16.7;
  const e = env(t, s, 0.6, 18.6, 0.4);
  if (e <= 0.001) return null;
  const k = easeOut(pClamp((t - s) / 0.8, 0, 1));
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: e }}>
      <div style={{ position: 'absolute', top: 452, left: 0, right: 0, textAlign: 'center',
        transform: `translateY(${(1 - k) * 20}px)` }}>
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 130, lineHeight: 0.86,
          letterSpacing: '0.02em', textTransform: 'uppercase', color: AIR }}>
          TRUE <span style={{ color: ACCENT }}>VOICE</span>
        </div>
        <div style={{ marginTop: 30, fontFamily: BODY, fontSize: 26, fontWeight: 600,
          letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(176,174,168,1)' }}>
          Роман Семенчук · Київ
        </div>
      </div>
    </div>
  );
}

/* ---------- timestamp label for commenting ---------- */
function StageClock({ t }) {
  const sec = Math.floor(t);
  React.useEffect(() => {
    const root = document.getElementById('promo-root');
    if (root) root.setAttribute('data-screen-label', `t=${sec}s`);
  }, [sec]);
  return null;
}

/* ---------- root ---------- */
function Promo() {
  const t = window.useTime ? window.useTime() : 0;
  const { Stage } = window;
  // global field intensity across the arc
  const I = window.interpolate(
    [0, 1.2, 3.0, 7.0, 11.0, 13.6, 14.2, 16.6, 19],
    [0.2, 0.55, 1.0, 0.85, 1.15, 0.7, 0.8, 0.55, 0.4]
  );
  return (
    <div id="promo-root" style={{ position: 'absolute', inset: 0, background: '#060607', overflow: 'hidden' }}>
      <window.PromoField accent={ACCENT} intensity={I(t)} />
      {/* scan-line texture */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4, mixBlendMode: 'overlay',
        backgroundImage: 'repeating-linear-gradient(180deg, rgba(246,244,240,0.04) 0 1px, transparent 1px 4px)' }} />
      {/* corner ticks */}
      {[['tl', { top: 54, left: 54, borderTop: '2px solid', borderLeft: '2px solid' }],
        ['tr', { top: 54, right: 54, borderTop: '2px solid', borderRight: '2px solid' }],
        ['bl', { bottom: 54, left: 54, borderBottom: '2px solid', borderLeft: '2px solid' }],
        ['br', { bottom: 54, right: 54, borderBottom: '2px solid', borderRight: '2px solid' }]].map(([k, st]) => (
        <span key={k} style={{ position: 'absolute', width: 38, height: 38,
          borderColor: 'rgba(246,244,240,0.3)', ...st }} />
      ))}
      {/* REC tape */}
      <div style={{ position: 'absolute', top: 60, left: 0, right: 0, textAlign: 'center',
        fontFamily: DISP, fontSize: 20, letterSpacing: '0.3em', textTransform: 'uppercase',
        color: 'rgba(110,108,104,1)', display: 'flex', justifyContent: 'center', gap: 16, alignItems: 'center' }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: ACCENT,
          opacity: 0.5 + 0.5 * Math.abs(Math.sin(t * 3)) }} />
        <span style={{ color: ACCENT }}>REC</span>
        <span>· VOX 432 Hz · TC 00:00:{String(Math.floor(t)).padStart(2, '0')}</span>
      </div>

      <StageClock t={t} />
      <S1 t={t} /><S2 t={t} /><S3 t={t} /><S4 t={t} /><S5 t={t} /><S6 t={t} />
    </div>
  );
}

window.Promo = Promo;
