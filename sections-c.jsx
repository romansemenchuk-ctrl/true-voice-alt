/* @jsx React.createElement */
/* =========================================================
   TRUE VOICE — sections C
   Bonuses · Outcomes · BeforeAfter · Voices · Guarantee ·
   Countdown/FinalCTA · FAQ · Footer · Sticky bar · Popup
   ========================================================= */

const { useState: useStateC, useEffect: useEffectC, useRef: useRefC } = React;

/* ---------- BONUSES ---------- */
function Bonuses() {
  const items = [
    { t: 'PDF-гайди до кожного уроку',  d: 'Письмові матеріали з поясненням механізмів і додатковими вправами.', tag: 'PDF · 7' },
    { t: 'Аудіо-версії всіх практик',   d: 'Можна слухати і виконувати без відео — зручно в дорозі.',           tag: 'MP3 · 7'  },
    { t: 'Підтримка через Telegram-бот',d: 'Нагадування про практики і відповіді на питання.',                   tag: 'BOT · 24/7' },
  ];
  return (
    <section className="tv-section tv-bonuses">
      <window.SectionHead
        idx={6}
        eyebrow="Бонуси · в комплекті"
        title={<>Три бонуси —<br className="tv-hide-narrow"/> без додаткової оплати.</>}
        max="36ch"
      />
      <div className="tv-bonus-grid">
        {items.map((it) => (
          <article key={it.t} className="tv-bonus-card">
            <span className="tag">{it.tag}</span>
            <h3 className="tv-h3">{it.t}</h3>
            <p className="tv-body">{it.d}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- OUTCOMES — Що отримаєш за 7 днів ---------- */
function Outcomes() {
  const items = [
    'Природне глибоке дихання замість поверхневого',
    'Розслаблену щелепу і вільний резонанс',
    'Відкриті груди і об’ємне звучання',
    'Техніки швидкого відновлення голосу',
    'Розуміння, де в тілі живе напруга',
    'Протоколи для різних ситуацій: до виступу, після стресу, зранку',
  ];
  return (
    <section className="tv-section tv-outcomes">
      <window.SectionHead
        idx={7}
        eyebrow="Результат · 7 днів"
        title={<>Що буде з твоїм голосом<br className="tv-hide-narrow"/> через тиждень.</>}
        max="36ch"
      />
      <ul className="tv-outcome-grid">
        {items.map((it, i) => (
          <li key={it} className="tv-outcome">
            <span className="tick" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path d="M3 8.5 L7 12 L13 4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="idx">0{i + 1}</span>
            <span className="t">{it}</span>
          </li>
        ))}
      </ul>
      <div className="tv-outcome-summary">
        <span className="tv-overline" style={{ color: 'var(--tv-accent)' }}>Підсумок</span>
        <p className="tv-body" style={{ color: 'var(--fg)', maxWidth: '54ch', fontSize: 17 }}>
          Без курсу голос непередбачуваний і підводить у важливі моменти.
          З курсом — маєш систему, яка <strong style={{ color: 'var(--tv-accent)' }}>працює завжди</strong>.
        </p>
      </div>
    </section>
  );
}

/* ---------- BEFORE / AFTER — Було / Стане ---------- */
function BeforeAfter() {
  const before = [
    'Голос зраджує перед виступом',
    'Постійна напруга в тілі',
    'Поверхневе дихання',
    'Страх важливих розмов',
  ];
  const after = [
    'Впевнене звучання в будь-якій ситуації',
    'Розслаблене тіло і вільний голос',
    'Глибоке природне дихання',
    'Спокій і присутність у спілкуванні',
  ];
  return (
    <section className="tv-section tv-ba">
      <window.SectionHead
        idx={8}
        eyebrow="Трансформація · до / після"
        title={<>Було.<br/><span style={{ fontStyle:'italic', fontWeight: 300 }}>Стане.</span></>}
        max="32ch"
      />
      <div className="tv-ba-grid">
        <div className="tv-ba-col tv-ba-col--before">
          <header>
            <span className="tv-overline" style={{ color: 'var(--fg-faint)' }}>Зараз</span>
            <h3 className="tv-h3" style={{ color: 'var(--fg-muted)' }}>Голос, який не слухається.</h3>
          </header>
          <ul>
            {before.map((b) => (
              <li key={b}>
                <span className="mark mark--cross" aria-hidden="true">✗</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="tv-ba-divider" aria-hidden="true">
          <span/>
          <em>через 7 днів</em>
          <span/>
        </div>
        <div className="tv-ba-col tv-ba-col--after">
          <header>
            <span className="tv-overline" style={{ color: 'var(--tv-accent)' }}>Через 7 днів</span>
            <h3 className="tv-h3" style={{ color: 'var(--fg)' }}>Голос, що повертається.</h3>
          </header>
          <ul>
            {after.map((a) => (
              <li key={a}>
                <span className="mark mark--check" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="14" height="14">
                    <path d="M3 8.5 L7 12 L13 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- VOICES — Відгуки студентів ---------- */
function VoiceSignal({ seed = 0, hot = 18 }) {
  const bars = Array.from({ length: 24 }, (_, i) => {
    const peak = Math.abs(Math.sin((i + seed * 7) * 0.7)) * 0.9 + 0.18;
    const delay = (i * 0.03).toFixed(2);
    const dur   = (1.2 + (i % 5) * 0.16).toFixed(2);
    return (
      <i key={i}
         className={i > hot ? 'hot' : ''}
         style={{
           height: `${peak * 100}%`,
           animationDelay: `${delay}s`,
           animationDuration: `${dur}s`,
         }}/>
    );
  });
  return <div className="signal" aria-hidden="true">{bars}</div>;
}

function Voices() {
  const voices = [
    {
      ini: 'ВЛ',
      who: 'Віталій Лаврентьєв',
      role: 'підприємець',
      q: 'Ніколи не думав, що звук народжується саме так. Наразі все стало по-іншому — круто, коли ти володієш своїм голосом. Ваш курс — це база, яка потрібна не тільки вокалістам, а взагалі всім людям.',
      hot: 19,
    },
    {
      ini: 'ВТ',
      who: 'Віктор Терент’єв',
      role: 'бізнес-коуч',
      q: 'Виявилось, що в мене горло було затиснуте майже 24/7. Я це навіть не помічав. На 3–4 день почало відпускати щелепу, голос став нижчий, тепліший. І прикол у тому, що я став менше зриватись на людей.',
      hot: 16,
    },
    {
      ini: 'ОК',
      who: 'Олена Кравченко',
      role: 'викладач · 34 роки',
      q: 'До кінця робочого дня я буквально втрачала здатність говорити від втоми. Тепер знаю, як швидко відновити голос і не доводити до виснаження. Студенти кажуть, що стала говорити впевненіше.',
      hot: 21,
    },
  ];
  return (
    <section className="tv-section tv-voices-section" id="voices">
      <window.SectionHead
        idx={9}
        eyebrow="Відгуки · польові записи"
        title={<>Від тих, хто пройшов.</>}
      />
      <div className="tv-voices">
        {voices.map((v, i) => (
          <article className="tv-voice" key={v.who}>
            <div className="tv-voice-head">
              <div className="ava" aria-hidden="true">{v.ini}</div>
              <div>
                <div className="who">{v.who}</div>
                <div className="role">{v.role}</div>
              </div>
              <span className="fr">FR · 0{i+1}</span>
            </div>
            <VoiceSignal seed={i} hot={v.hot}/>
            <blockquote>
              <span className="q">“</span>{v.q}<span className="q">”</span>
            </blockquote>
            <footer>
              <span className="stars" aria-label="5 з 5">★★★★★</span>
              <span className="tv-overline" style={{ color: 'var(--fg-faint)' }}>Verified</span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- GUARANTEE — 14 days ---------- */
function Guarantee() {
  return (
    <section className="tv-section tv-guarantee">
      <div className="tv-guarantee-card">
        <div className="tv-guarantee-seal" aria-hidden="true">
          <svg viewBox="0 0 200 200" width="100%" height="100%">
            <defs>
              <radialGradient id="goldHalo" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="rgba(201,162,39,0.45)"/>
                <stop offset="65%" stopColor="rgba(201,162,39,0.05)"/>
                <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="98" fill="url(#goldHalo)"/>
            <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(201,162,39,0.45)" strokeWidth="0.6"/>
            <circle cx="100" cy="100" r="64" fill="none" stroke="rgba(201,162,39,0.25)" strokeWidth="0.5"/>
            {/* tick ring */}
            {Array.from({length: 14}).map((_, i) => {
              const a = -Math.PI/2 + (i / 14) * Math.PI * 2;
              const x1 = 100 + Math.cos(a) * 90, y1 = 100 + Math.sin(a) * 90;
              const x2 = 100 + Math.cos(a) * 84, y2 = 100 + Math.sin(a) * 84;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(201,162,39,0.7)" strokeWidth="1.2"/>;
            })}
            <text x="100" y="92" textAnchor="middle"
              fontFamily="Stratos, Inter, sans-serif"
              fontWeight="800" fontSize="62"
              letterSpacing="-0.04em" fill="#C9A227">14</text>
            <text x="100" y="118" textAnchor="middle"
              fontFamily="Inter, sans-serif"
              fontWeight="500" fontSize="11"
              letterSpacing="0.32em" fill="rgba(201,162,39,0.85)">ДНІВ</text>
            <text x="100" y="148" textAnchor="middle"
              fontFamily="Inter, sans-serif"
              fontWeight="500" fontSize="8"
              letterSpacing="0.30em" fill="rgba(245,245,242,0.55)">ГАРАНТІЯ</text>
          </svg>
        </div>
        <div className="tv-guarantee-body">
          <span className="tv-overline" style={{ color: 'var(--tv-gold)' }}>Гарантія повернення</span>
          <h2 className="tv-h2" style={{ marginTop: 10 }}>
            14 днів, щоб <span style={{ fontStyle: 'italic', fontWeight: 300 }}>передумати</span>.
          </h2>
          <p className="tv-body" style={{ marginTop: 18, maxWidth: '46ch' }}>
            Якщо протягом 14 днів зрозумієш, що курс не для тебе — повернемо гроші без зайвих питань.
            Ти нічим не ризикуєш, тільки отримуєш можливість нарешті почути свій справжній голос.
          </p>
          <p className="tv-small" style={{ marginTop: 14, maxWidth: '46ch' }}>
            7 місяців доступу · оплата через WayForPay · ФОП на УРР · документи відкриті.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- COUNTDOWN ---------- */
function useCountdown() {
  const [t, setT] = useStateC(() => calc());
  useEffectC(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  function calc() {
    const target = new Date();
    target.setDate(target.getDate() + 1);
    target.setHours(0, 0, 0, 0);
    const diff = Math.max(0, target - new Date());
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);
    return { days, hours, mins, secs };
  }
  return t;
}

function CountdownBoxes() {
  const t = useCountdown();
  const cells = [
    [t.days,  'днів'],
    [t.hours, 'годин'],
    [t.mins,  'хвилин'],
    [t.secs,  'секунд'],
  ];
  return (
    <div className="tv-countdown-boxes">
      {cells.map(([n, l], i) => (
        <div className="cd-box" key={l}>
          <span className="cd-num">{String(n).padStart(2,'0')}</span>
          <span className="cd-lbl">{l}</span>
          {i < cells.length - 1 ? <span className="cd-sep" aria-hidden="true">:</span> : null}
        </div>
      ))}
    </div>
  );
}

/* ---------- FINAL CTA — countdown + offer ---------- */
function FinalCTA({ onApply }) {
  return (
    <section className="tv-section tv-final" id="apply">
      <div className="tv-final-card">
        <div className="tv-final-head">
          <window.Eyebrow tone="accent" dot>Останній шанс · ціна повертається до 100 $</window.Eyebrow>
          <h2 className="tv-h2" style={{ marginTop: 14, maxWidth: '20ch' }}>
            До кінця <span style={{ fontStyle: 'italic', fontWeight: 300 }}>акції</span>.
          </h2>
        </div>

        <CountdownBoxes/>

        <div className="tv-final-progress">
          <div className="bar"><span style={{ width: '30%' }}/></div>
          <span className="tv-overline" style={{ color: 'var(--fg-faint)' }}>
            30% місць вже заброньовано
          </span>
        </div>

        <div className="tv-final-offer">
          <div className="tv-final-price">
            <span className="old">100&nbsp;$</span>
            <span className="arr">→</span>
            <span className="new">15&nbsp;$</span>
          </div>
          <button className="tv-btn tv-btn--big" onClick={onApply}>
            Забрати від&nbsp;15$ <span className="arrow">→</span>
          </button>
          <ul className="tv-final-list">
            <li><span className="b"/>7 практик по 15–20 хвилин</li>
            <li><span className="b"/>PDF-гайди + аудіо-версії</li>
            <li><span className="b"/>Підтримка через Telegram-бот</li>
            <li><span className="b"/>7 місяців доступу</li>
            <li><span className="b"/>14 днів гарантії повернення</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FAQ() {
  const items = [
    { q: 'Чи потрібна музична освіта?',
      a: 'Ні, зовсім не потрібна. Система працює з природними механізмами тіла, які є в кожного. Не потрібно вміти співати або грати на інструментах.' },
    { q: 'Що якщо мені 50+ років?',
      a: 'Вік не має значення. Дихання, розслаблення м’язів і робота з нервовою системою працюють у будь-якому віці. Навпаки, з віком ці навички стають ще важливішими.' },
    { q: '7 днів — це серйозно?',
      a: 'Перші зміни відчуваєш вже після першої практики. За 7 днів формується новий тілесний досвід. Це не фінал, а початок — база, на якій можеш будувати далі.' },
    { q: 'Що якщо не доведу до кінця?',
      a: 'Доступ до курсу — 7 місяців. Можеш проходити у своєму темпі, повертатися до уроків, перепроходити практики. Ніякого тиску і дедлайнів.' },
    { q: 'Чи допоможе при хронічній хрипоті?',
      a: 'Якщо хрипота не пов’язана з серйозними медичними проблемами, то так. Часто хрипота — це наслідок хронічної напруги. Але при серйозних симптомах спочатку до лікаря.' },
  ];
  return (
    <section className="tv-section" id="faq">
      <window.SectionHead
        idx={10}
        eyebrow="Часті питання"
        title={<>Питання, які виникають<br className="tv-hide-narrow"/> до того, як ти оплатиш.</>}
        max="40ch"
      />
      <div className="tv-faq">
        {items.map((it, i) => (
          <details className="tv-faq-item" key={it.q} {...(i === 0 ? { open: true } : {})}>
            <summary>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <span className="q">{it.q}</span>
            </summary>
            <div className="a">{it.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer className="tv-footer">
      <div className="tv-footer-top">
        <div className="brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="assets/logo-monogram.svg" width="36" height="36" alt=""/>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 18, letterSpacing: '0.05em', textTransform: 'uppercase',
                color: 'var(--fg)',
              }}>TRUE VOICE</div>
              <div className="tv-overline" style={{ marginTop: 4 }}>Курс Романа Семенчука · Київ</div>
            </div>
          </div>
          <p>
            7-денний онлайн-курс на перетині вокального досвіду, спортивної реабілітації і нейрофізіології.
            Telegram-бот як канал доставки. 7 місяців доступу. 14 днів гарантії повернення.
          </p>
          <div className="tv-footer-onair">
            <span className="dot"/>
            <span style={{ color: 'var(--tv-accent)' }}>В ефірі</span>
            <span style={{ color: 'var(--fg-faint)' }}>· <window.Clock/></span>
          </div>
        </div>

        <div className="tv-footer-cols">
          <div>
            <h4>Контакти</h4>
            <ul>
              <li>info@true-voice.com.ua</li>
              <li>+38 (000) 000-00-00</li>
              <li style={{ color: 'var(--fg-faint)' }}>м. Київ</li>
            </ul>
          </div>
          <div>
            <h4>Документи</h4>
            <ul>
              <li><a href="#">Політика конфіденційності</a></li>
              <li><a href="#">Публічна оферта</a></li>
              <li><a href="#">Гарантія повернення</a></li>
            </ul>
          </div>
          <div>
            <h4>Соцмережі</h4>
            <ul>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">YouTube</a></li>
              <li><a href="#">Telegram-канал</a></li>
              <li><a href="#">Facebook</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="tv-footer-disclaimer">
        <p>
          <strong style={{ color: 'var(--fg-muted)' }}>ВАЖЛИВО:</strong> не вводьте контактну інформацію,
          доки не прочитаєте legal disclaimer. Ми не даємо гарантій конкретних результатів за допомогою наших інструментів,
          стратегій або інформації. Всі продукти і сервіси компанії — для освітніх цілей.
          Жодна інформація на цьому сайті не гарантує і не обіцяє отримання результатів.
          Ви несете відповідальність за свої дії і результати.
          Реєструючись на даному сайті, ви знімаєте з нас відповідальність за ваші дії та результати.
        </p>
      </div>

      <div className="tv-footer-bottom">
        <span>ФОП Петренко П.П. · © 2026 · TRUE VOICE</span>
        <span style={{ color: 'var(--fg-muted)' }}>Set in Stratos &amp; Inter · v.2026.05</span>
        <span>Made in Kyiv · UA</span>
      </div>
    </footer>
  );
}

/* ---------- STICKY BOTTOM BAR ---------- */
function StickyBar({ onApply }) {
  const [show, setShow] = useStateC(false);
  useEffectC(() => {
    function onScroll() {
      const y = window.scrollY || 0;
      const doc = document.documentElement;
      const nearBottom = (y + window.innerHeight) > (doc.scrollHeight - 220);
      setShow(y > 520 && !nearBottom);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className={`tv-sticky ${show ? 'visible' : ''}`} aria-hidden={!show}>
      <div className="tv-sticky-info">
        <div className="price">
          <span className="old">100&nbsp;$</span>
          <span className="new">15&nbsp;$</span>
        </div>
        <span className="tv-sticky-tag">14 днів гарантії</span>
      </div>
      <button className="tv-btn tv-btn--big" onClick={onApply}>
        Забрати від&nbsp;15$ <span className="arrow">→</span>
      </button>
    </div>
  );
}

/* ---------- POPUP ---------- */
function Popup({ open, onClose }) {
  const [email, setEmail] = useStateC('');
  const [phone, setPhone] = useStateC('');
  const [sent,  setSent]  = useStateC(false);
  const overlayRef = useRefC(null);

  useEffectC(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  function submit(e) {
    e.preventDefault();
    if (!/.+@.+\..+/.test(email)) return;
    if (phone.replace(/\D/g,'').length < 7) return;
    setSent(true);
  }

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  const t = useCountdown();

  if (!open) return null;
  return (
    <div className="tv-popup-overlay" ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className="tv-popup">
        <button className="tv-popup-close" onClick={onClose} aria-label="Закрити">×</button>

        <span className="tv-overline" style={{ color: 'var(--tv-accent)' }}>Реєстрація · TRUE VOICE</span>
        <h3 className="tv-h2" style={{ fontSize: 'clamp(28px, 7vw, 40px)', marginTop: 8 }}>
          Забрати від <span style={{ color:'var(--tv-accent)' }}>15$</span> зараз.
        </h3>
        <p className="tv-body" style={{ marginTop: 12, maxWidth: '38ch' }}>
          7 практик по 15–20 хвилин через Telegram-бот. 7 місяців доступу. 14 днів гарантії повернення.
        </p>

        <div className="tv-popup-price">
          <span className="old">100&nbsp;$</span>
          <span className="arr">→</span>
          <span className="new">15&nbsp;$</span>
        </div>

        {sent ? (
          <div className="tv-popup-success">
            <span className="tv-overline" style={{ color: 'var(--tv-gold)' }}>Заявку отримано</span>
            <h4 className="tv-h3" style={{ marginTop: 10 }}>
              Зараз перенаправимо тебе на оплату.
            </h4>
            <p className="tv-small" style={{ marginTop: 12 }}>
              Лист із доступом до Telegram-бота прийде на пошту після підтвердження оплати.
              Якщо щось пішло не так — напиши нам на <strong>info@true-voice.com.ua</strong>.
            </p>
            <button className="tv-btn tv-btn--ghost" style={{ marginTop: 18 }} onClick={onClose}>
              Закрити
            </button>
          </div>
        ) : (
          <form className="tv-popup-form" onSubmit={submit}>
            <label>
              <span className="tv-overline">Email</span>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ти@приклад.com"
                autoComplete="email"/>
            </label>
            <label>
              <span className="tv-overline">Телефон</span>
              <input
                type="tel" required value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+380 00 000 0000"
                autoComplete="tel"/>
            </label>
            <button className="tv-btn tv-btn--big" type="submit">
              Забрати від&nbsp;15$ <span className="arrow">→</span>
            </button>
            <p className="tv-small" style={{ marginTop: 4 }}>
              14 днів гарантії повернення. Натискаючи кнопку, ти погоджуєшся з{' '}
              <a href="#" style={{ color: 'var(--fg-muted)' }}>офертою</a> та{' '}
              <a href="#" style={{ color: 'var(--fg-muted)' }}>політикою</a>.
            </p>
          </form>
        )}

        <div className="tv-popup-countdown">
          <span className="tv-overline" style={{ color: 'var(--fg-faint)' }}>До кінця акції</span>
          <div>
            <span>{String(t.hours).padStart(2,'0')}</span>
            <em>:</em>
            <span>{String(t.mins).padStart(2,'0')}</span>
            <em>:</em>
            <span>{String(t.secs).padStart(2,'0')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Bonuses, Outcomes, BeforeAfter, Voices, Guarantee,
  FinalCTA, FAQ, Footer, StickyBar, Popup, useCountdown
});
