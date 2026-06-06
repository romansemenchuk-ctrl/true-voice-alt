/* @jsx React.createElement */
/* =========================================================
   TRUE VOICE — sections A
   Nav · Hero · Manifest · Pains
   ========================================================= */

const { useState, useEffect, useRef } = React;

/* ---------- SHARED PRIMITIVES ---------- */

function Eyebrow({ children, tone = 'muted', dot = false, style }) {
  const colors = {
    accent: 'var(--tv-accent)',
    gold: 'var(--tv-gold)',
    muted: 'var(--fg-muted)'
  };
  return (
    <span className="tv-eyebrow" style={{ color: colors[tone] || colors.muted, ...(style || {}) }}>
      {dot ? <span className="dot" /> : null}
      {children}
    </span>);

}

function SectionHead({ idx, eyebrow, title, sub, align = 'left', max = '32ch' }) {
  return (
    <header className="tv-sh" style={{
      textAlign: align,
      marginBottom: 28,
      display: 'flex', flexDirection: 'column',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      gap: 18
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        justifyContent: align === 'center' ? 'center' : 'flex-start'
      }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontVariantNumeric: 'tabular-nums',
          fontSize: 10, fontWeight: 600, letterSpacing: '0.22em',
          color: 'var(--tv-accent)'
        }}>{String(idx).padStart(3, '0')}</span>
        <span style={{ width: 28, height: 1, background: 'var(--hairline-strong)' }} />
        <span className="tv-overline">{eyebrow}</span>
      </div>
      <h2 className="tv-h2">{title}</h2>
      {sub ? <p className="tv-body" style={{ maxWidth: max, margin: 0 }}>{sub}</p> : null}
    </header>);

}

/* ---------- KYIV CLOCK ---------- */
function Clock({ tz = 'Europe/Kiev' }) {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const s = new Intl.DateTimeFormat('uk-UA', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).format(t);
  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{s} Київ</span>;
}

/* ---------- NAV ---------- */
function Nav({ onApply }) {
  const [open, setOpen] = useState(false);
  const items = [
  ['Метод', '#method'],
  ['Програма', '#program'],
  ['Про автора', '#author'],
  ['Відгуки', '#voices'],
  ['FAQ', '#faq']];


  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {document.body.style.overflow = '';};
  }, [open]);

  return (
    <>
      <header className="tv-nav" role="banner">
        <div className="tv-nav-strip">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--tv-accent)',
              boxShadow: '0 0 8px var(--tv-accent-glow)',
              animation: 'tvPulse 1.6s ease-in-out infinite'
            }} />
            <span style={{ color: 'var(--tv-accent)' }}>В ефірі</span>
            <span className="tv-hide-narrow" style={{ color: 'var(--fg-faint)' }}>· Київ · TRUE VOICE</span>
          </span>
          <span style={{ color: 'var(--fg-muted)' }}>
            <Clock />
          </span>
        </div>

        <div className="tv-nav-bar">
          <a href="#top" style={{
            display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none'
          }} onClick={() => setOpen(false)}>
            <img src="assets/logo-monogram.svg" width="24" height="24" alt="" />
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'var(--fg)'
            }}>TRUE VOICE</span>
            <span className="tv-hide-narrow" style={{
              fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 500,
              letterSpacing: '0.30em', textTransform: 'uppercase', color: 'var(--fg-faint)'
            }}>/ Academy</span>
          </a>

          <nav className="tv-nav-links">
            {items.map((it, i) =>
            <a key={it[0]} href={it[1]} style={{
              fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'var(--fg-muted)', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'baseline', gap: 6
            }}>
                <span style={{ fontSize: 9, color: 'var(--fg-faint)' }}>{String(i + 1).padStart(2, '0')}</span>
                {it[0]}
              </a>
            )}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              className="tv-nav-cta"
              onClick={() => {onApply && onApply();setOpen(false);}}
              style={{
                fontFamily: 'var(--font-body)', fontSize: 10.5, fontWeight: 600,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'var(--fg)', border: 0,
                padding: '10px 14px', background: 'var(--tv-accent)',
                boxShadow: '0 0 24px var(--tv-accent-glow)',
                cursor: 'pointer'
              }}>
              від&nbsp;15$&nbsp;→
            </button>
            <button
              className={`tv-burger ${open ? 'is-open' : ''}`}
              aria-label={open ? 'Закрити меню' : 'Меню'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}>
              
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className={`tv-drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <ol>
          {items.map((it, i) =>
          <li key={it[0]}>
              <a href={it[1]} onClick={() => setOpen(false)}>
                {it[0]}
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
              </a>
            </li>
          )}
        </ol>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 32 }}>
          <button className="tv-btn" onClick={() => {onApply && onApply();setOpen(false);}}>
            Забрати від 15$ <span className="arrow">→</span>
          </button>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
            letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--fg-faint)'
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--tv-accent)', boxShadow: '0 0 8px var(--tv-accent-glow)',
              animation: 'tvPulse 1.6s ease-in-out infinite'
            }} />
            <span style={{ color: 'var(--tv-accent)' }}>В ефірі</span>
            <span>· <Clock /></span>
          </div>
        </div>
      </div>
    </>);

}

/* ---------- HERO ---------- */
function startDateLabel() {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return `${String(t.getDate()).padStart(2, '0')}.${String(t.getMonth() + 1).padStart(2, '0')}`;
}

function Hero({ onApply, motion = 'cinematic' }) {
  const reduced = motion === 'off';
  const density = motion === 'cinematic' ? 1 : 0.55;
  const heroRef = useRef(null);
  const stageRef = useRef(null);

  // gentle parallax: stage scales slightly on scroll, rotates 0.5°
  useEffect(() => {
    if (reduced) return;
    let raf = 0, sy = 0;
    function tick() {
      if (!stageRef.current) return;
      const max = window.innerHeight * 0.8;
      const k = Math.min(sy, max) / max;
      const ty = k * -40;
      const sc = 1 + k * 0.04;
      stageRef.current.style.transform =
        `translate3d(0, ${ty.toFixed(1)}px, 0) scale(${sc.toFixed(4)})`;
      raf = 0;
    }
    function onScroll() {
      sy = window.scrollY || 0;
      if (!raf) raf = requestAnimationFrame(tick);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [reduced]);

  return (
    <section className="tv-hero" id="top" ref={heroRef}>
      {/* central 3D stage — the voice column lives here */}
      <div className="tv-hero-stage" ref={stageRef} aria-hidden="true">
        {/* slow-rotating sacred armature */}
        <svg className="tv-hero-armature" viewBox="0 0 600 600">
          <defs>
            <radialGradient id="armGlow" cx="50%" cy="50%" r="50%">
              <stop offset="55%" stopColor="rgba(245,232,200,0)" />
              <stop offset="100%" stopColor="rgba(201,162,39,0.18)" />
            </radialGradient>
          </defs>
          <g stroke="rgba(201,162,39,0.30)" strokeWidth="0.6" fill="none">
            <circle cx="300" cy="300" r="288" stroke="rgba(245,245,242,0.12)" />
            <circle cx="300" cy="300" r="240" />
            <circle cx="300" cy="300" r="182" stroke="rgba(245,245,242,0.06)" />
            {/* hexagram — sacred geometry */}
            <polygon points="300,80 491,410 109,410" />
            <polygon points="300,520 491,190 109,190" />
            {/* outer tick ring */}
            {Array.from({ length: 36 }).map((_, i) => {
              const a = i / 36 * Math.PI * 2;
              const x1 = 300 + Math.cos(a) * 296, y1 = 300 + Math.sin(a) * 296;
              const len = i % 3 === 0 ? 14 : 7;
              const x2 = 300 + Math.cos(a) * (296 - len), y2 = 300 + Math.sin(a) * (296 - len);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={i % 3 === 0 ? 'rgba(201,162,39,0.6)' : 'rgba(245,245,242,0.20)'}/>;
            })}
          </g>
          <circle cx="300" cy="300" r="320" fill="url(#armGlow)" />
        </svg>

        {/* second counter-rotating armature ring */}
        <svg className="tv-hero-armature tv-hero-armature--inner" viewBox="0 0 600 600">
          <g stroke="rgba(245,245,242,0.10)" strokeWidth="0.5" fill="none">
            <circle cx="300" cy="300" r="138" />
            <circle cx="300" cy="300" r="96"  stroke="rgba(200,16,46,0.30)"/>
            {/* vesica piscis */}
            <circle cx="240" cy="300" r="120" />
            <circle cx="360" cy="300" r="120" />
          </g>
        </svg>

        {/* canvas 3D — the breathing column itself */}
        {motion === 'wall' && window.VoiceWall
          ? <window.VoiceWall accent="#C8102E" density={density} reduced={reduced}/>
          : window.VoiceColumn
            ? <window.VoiceColumn accent="#C8102E" density={density} reduced={reduced}/>
            : null}

        {/* horizon glow */}
        <div className="tv-hero-horizon"/>
      </div>

      {/* coordinate ticks (left + right) */}
      <div className="tv-hero-coord tv-hero-coord--left" aria-hidden="true">
        <span>00°</span><span>22°</span><span>45°</span><span>68°</span><span>90°</span>
      </div>
      <div className="tv-hero-coord tv-hero-coord--right" aria-hidden="true">
        <span>RES</span><span>·</span><span>OPN</span><span>·</span><span>AXS</span>
      </div>

      {/* main content */}
      <div className="tv-hero-inner">
        <div className="tv-hero-meta">
          <span className="tv-pill">Онлайн-курс від Романа Семенчука</span>
          <span className="tv-pill tv-pill--accent">
            <span className="dot" />
            Старт {startDateLabel()}
          </span>
        </div>

        <div className="tv-hero-wordmark tv-reveal" aria-label="TRUE VOICE">
          <span className="t1">TRUE</span>
          <span className="t2">VOICE</span>
        </div>

        <h1 className="tv-hero-headline tv-reveal" style={{ animationDelay: '120ms' }}>
          Перестань <span className="ital">втрачати</span> голос<br/>
          перед виступом —<br/>
          <span className="tv-hero-accent">7 днів до живого звучання<span className="dot">.</span></span>
        </h1>

        <p className="tv-hero-sub tv-reveal" style={{ animationDelay: '220ms' }}>
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
            <span className="tv-hero-trust-mark">★★★★★</span>
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

      {/* tape-code bottom strip */}
      <div className="tv-hero-tape" aria-hidden="true">
        <span>TC · 00:00:18</span>
        <span>·</span>
        <span>VOX · 432 Hz</span>
        <span>·</span>
        <span>ƒ 2.0</span>
        <span>·</span>
        <span className="dot"/>
        <span>REC</span>
      </div>
    </section>);

}

/* ---------- MANIFEST — Що таке соматичний підхід ---------- */
function Manifest() {
  const rows = [
  {
    idx: 'I',
    lead: <>Тіло і голос — <span className="em">єдина система</span>.</>,
    sub: 'Напруга в щелепі, стиснуті груди, поверхневе дихання миттєво блокують природне звучання. Розслабляєш тіло — звільняєш голос.',
    sym: 'symbol-fascia'
  },
  {
    idx: 'II',
    lead: <>Нервова система <span className="em">керує звуком</span>.</>,
    sub: 'Коли мозок сприймає ситуацію як загрозу, він відключає доступ до всіх навичок. Заспокоюєш систему — повертаєш контроль.',
    sym: 'symbol-resonance'
  },
  {
    idx: 'III',
    lead: <>Практика — <span className="em">через відчуття</span>.</>,
    sub: 'Конкретні тілесні практики, які можна відчути і відтворити в будь-який момент.',
    sym: 'symbol-axis'
  }];

  return (
    <section className="tv-section tv-manifest" id="method">
      <SectionHead
        idx={1}
        eyebrow="Метод · соматичний підхід"
        title={<>Що таке соматичний підхід<br className="tv-hide-narrow" /> до голосу — і чому це працює.</>}
        sub="Голос — це не просто звук. Це відображення стану всього тіла і нервової системи."
        max="50ch" />
      
      <div className="tv-manifest-list">
        {rows.map((r) =>
        <div className="tv-manifest-row" key={r.idx}>
            <div className="idx">{r.idx}</div>
            <h3 className="lead">{r.lead}</h3>
            <p className="sub">{r.sub}</p>
          </div>
        )}
      </div>
    </section>);

}

/* ---------- PAINS — Впізнаєш себе? ---------- */
function Pains() {
  const items = [
  {
    t: 'Голос зраджує в найважливіший момент',
    d: 'Стоїш перед аудиторією — і саме тоді щось стискається в тілі. Голос тихне, зривається, виходить пласким. Всередині є що сказати, але назовні виходить щось інше.'
  },
  {
    t: 'Техніка не працює під тиском',
    d: 'Роками займаєшся вокалом або публічними виступами. Знаєш теорію, відпрацював техніку — але щойно підвищується ставка, тіло скидає все напрацьоване.'
  },
  {
    t: 'Голос перестав бути твоїм',
    d: 'Хрипкий, плаский, без сили. Люди не реагують або перебивають. Говориш тихіше, рідше, обережніше — і поступово відчуваєш, що зникаєш з простору.'
  },
  {
    t: 'Постійна напруга в тілі',
    d: 'Фонова напруга, яку давно перестав помічати. Дихати важко, щелепа стиснута, груди закриті. До кінця дня втрачаєш здатність нормально говорити від втоми.'
  }];

  return (
    <section className="tv-section tv-pains">
      <SectionHead
        idx={2}
        eyebrow="Симптоми · впізнаєш себе?"
        title={<>Чотири ситуації, які знайомі<br className="tv-hide-narrow" /> кожному, хто стикався з непередбачуваним голосом.</>}
        max="48ch" />
      
      <ol className="tv-pain-grid">
        {items.map((it, i) =>
        <li key={it.t} className="tv-pain-card">
            <div className="head">
              <span className="cross" aria-hidden="true">×</span>
              <span className="idx">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <h3 className="tv-h3">{it.t}</h3>
            <p className="tv-body">{it.d}</p>
          </li>
        )}
      </ol>
    </section>);

}

Object.assign(window, { Nav, Hero, Manifest, Pains, Eyebrow, SectionHead, Clock, startDateLabel });