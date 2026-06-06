/* @jsx React.createElement */
/* =========================================================
   TRUE VOICE — sections B
   Method · Founder · Program (7 days) · HowItWorks (4 steps)
   ========================================================= */

const { useEffect: useEffectB, useRef: useRefB } = React;

/* ---------- METHOD — Як працює система TrueVoice ---------- */
function Method() {
  const phases = [
    {
      n: 1,
      t: 'Відновлюємо природне дихання',
      d: 'Повертаєш глибоке дихання через діафрагму. Нервова система переходить у стан спокою, тіло розслабляється, голос отримує опору.',
      lat: 'spiritus',
    },
    {
      n: 2,
      t: 'Звільняємо затиснуті зони',
      d: 'Розслабляєш щелепу, язик, відкриваєш груди. Прибираєш фізичні блоки, які заважають природному резонансу.',
      lat: 'corpus',
    },
    {
      n: 3,
      t: 'Інтегруємо тіло і звук',
      d: 'Поєднуємо дихання, тіло і голос в єдину систему. Створюємо новий досвід, до якого можеш повертатися самостійно.',
      lat: 'resonantia',
    },
  ];
  return (
    <section className="tv-section tv-method">
      <window.SectionHead
        idx={3}
        eyebrow="Система · 3 фази"
        title={<>Від блокованого голосу<br className="tv-hide-narrow"/> до живого звучання за 7 днів.</>}
        sub="Метод працює в трьох рівнях одночасно: тіло, нерви, звук. Кожна практика змінює щось у всіх трьох."
        max="48ch"
      />

      <div className="tv-method-grid">
        {phases.map((p) => (
          <article key={p.n} className="tv-method-card">
            <div className="head">
              <span className="num">0{p.n}</span>
              <span className="lat">{p.lat}</span>
            </div>
            <h3 className="tv-h3">{p.t}</h3>
            <p className="tv-body">{p.d}</p>
            <span className="bar"/>
          </article>
        ))}
      </div>

      {/* small breath-interlude visual under the cards */}
      <div className="tv-method-axis" aria-hidden="true">
        <span/>
        <em>Vox redit ad corpus · голос повертається в тіло</em>
        <span/>
      </div>
    </section>
  );
}

/* ---------- FOUNDER ---------- */
function Founder() {
  const chips = [
    '30+ років співу',
    '1000+ концертів',
    '20+ років сценічного досвіду',
    '10+ років студійної роботи',
  ];

  return (
    <section className="tv-section tv-founder" id="author">
      <div className="tv-founder-grid">
        <aside className="tv-founder-plate" aria-hidden="true">
          {/* monogram-style plate with initials */}
          <div className="tv-founder-monogram">
            <svg viewBox="0 0 200 200" width="100%" height="100%">
              <defs>
                <radialGradient id="rsHalo" cx="50%" cy="50%" r="55%">
                  <stop offset="0%" stopColor="rgba(200,16,46,0.45)"/>
                  <stop offset="65%" stopColor="rgba(200,16,46,0.06)"/>
                  <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="98" fill="url(#rsHalo)"/>
              <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(245,245,242,0.10)" strokeWidth="0.7"/>
              <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(201,162,39,0.32)" strokeWidth="0.7"/>
              {/* tick ring */}
              {Array.from({length: 24}).map((_, i) => {
                const a = (i / 24) * Math.PI * 2;
                const x1 = 100 + Math.cos(a) * 88, y1 = 100 + Math.sin(a) * 88;
                const x2 = 100 + Math.cos(a) * 82, y2 = 100 + Math.sin(a) * 82;
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(245,245,242,0.35)" strokeWidth="0.6"/>;
              })}
              {/* monogram */}
              <text x="100" y="118" textAnchor="middle"
                fontFamily="Stratos, Inter, sans-serif"
                fontWeight="800" fontSize="80"
                letterSpacing="-0.04em" fill="#F5F5F2">РС</text>
              <line x1="100" y1="6" x2="100" y2="194" stroke="rgba(245,245,242,0.18)" strokeWidth="0.5"/>
            </svg>
          </div>

          <div className="tv-founder-frame">
            <span className="tv-overline">Plate · founder</span>
            <span className="tv-overline" style={{ color: 'var(--tv-gold)' }}>RS · 001</span>
          </div>
        </aside>

        <div className="tv-founder-body">
          <window.Eyebrow tone="accent" dot>Автор курсу · Київ</window.Eyebrow>
          <h2 className="tv-h2" style={{ marginTop: 12 }}>
            Роман <span style={{ fontStyle: 'italic', fontWeight: 300 }}>Семенчук</span>.
          </h2>

          <ul className="tv-chip-row" aria-label="Регалії">
            {chips.map((c) => <li key={c} className="tv-chip">{c}</li>)}
          </ul>

          <p className="tv-body" style={{ marginTop: 22, maxWidth: '48ch' }}>
            Учасник шоу <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>«Голос Країни» 2021</strong>.
            Виступав на найбільших українських фестивалях — ZaxidFest, Faine Misto, МHМ,
            Тарасова Гора, Бандерштат.
            Номінант премії <strong style={{ color: 'var(--tv-gold)', fontWeight: 500 }}>«Best Ukrainian Metal Act 2018»</strong>.
            Засновник музичних проектів <em>DIMICANDUM</em> і <em>THINKSIDE</em>.
          </p>

          <p className="tv-body" style={{ marginTop: 18, maxWidth: '48ch' }}>
            TrueVoice створив на перетині трьох галузей: вокального досвіду, спортивної реабілітації і нейрофізіології.
          </p>

          <div className="tv-founder-stats">
            {[
              ['30+',   'років співу'],
              ['1000+', 'концертів'],
              ['2021',  '«Голос Країни»'],
              ['2018',  'Best UA Metal Act'],
            ].map(([n, l]) => (
              <div key={l} className="cell">
                <div className="num">{n}</div>
                <div className="lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- PROGRAM — 7 days ---------- */
function Program() {
  const days = [
    { n: 1, t: 'Дихання і базова опора',           items: ['Відновлення природного дихання', 'Заспокоєння нервової системи'], out: 'Повертаєш глибоке дихання, тіло розслабляється.' },
    { n: 2, t: 'Щелепа, язик і перші звуки',       items: ['Розслаблення щелепи', 'Звуки «Мммм»'],                            out: 'Звільняєш затиснуті зони, голос стає м’якшим.' },
    { n: 3, t: 'Діафрагма: свобода дихання',        items: ['Робота з діафрагмою', 'Центрування в тілі'],                       out: 'Отримуєш стійку опору для голосу.' },
    { n: 4, t: 'Відкриття грудей і емоційного центру', items: ['Розкриття грудної клітки', 'Емоційне звучання'],                  out: 'Голос стає об’ємним і живим.' },
    { n: 5, t: 'Резонанс і мурчання',              items: ['Активація вібрацій', 'Звукова хвиля в тілі'],                       out: 'Відчуваєш, як голос резонує всім тілом.' },
    { n: 6, t: 'Заспокоєння через звук',           items: ['Техніки заспокоєння', 'Звук «Шшшш»'],                              out: 'Навчаєшся швидко відновлювати спокій.' },
    { n: 7, t: 'Інтеграція всієї системи',         items: ['Поєднання всіх практик', 'Цілісний досвід'],                       out: 'Маєш повну систему для самостійної роботи.' },
  ];
  return (
    <section className="tv-section tv-program" id="program">
      <window.SectionHead
        idx={4}
        eyebrow="Програма · 7 днів"
        title={<>Сім днів. Сім практик.<br className="tv-hide-narrow"/> Одне повернення голосу.</>}
        sub="Один урок на день, 15–20 хвилин. Telegram-бот веде тебе крок за кроком. Без вокальної теорії — тільки конкретні тілесні протоколи."
        max="48ch"
      />

      <ol className="tv-program-list">
        {days.map((d) => (
          <li key={d.n} className="tv-day">
            <div className="day-head">
              <span className="day-num">День {String(d.n).padStart(2,'0')}</span>
              <span className="day-len">15–20 хв</span>
            </div>
            <h3 className="day-t">{d.t}</h3>
            <ul className="day-items">
              {d.items.map((it) => (
                <li key={it}>
                  <span className="bullet" aria-hidden="true">↳</span>
                  {it}
                </li>
              ))}
            </ul>
            <p className="day-out">
              <span className="tv-overline" style={{ color: 'var(--tv-accent)', marginRight: 8 }}>Результат</span>
              {d.out}
            </p>
            <span className="day-axis" aria-hidden="true"/>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- HOW IT WORKS — 4 simple steps ---------- */
function HowItWorks({ onApply }) {
  const steps = [
    { n: 1, t: 'Оплачуєш курс',                    d: 'Отримуєш доступ до Telegram-бота з усіма матеріалами.' },
    { n: 2, t: 'Проходиш по одному уроку на день', d: '7 відеоуроків з практиками по 15–20 хвилин кожен.' },
    { n: 3, t: 'Виконуєш практики',                d: 'Конкретні вправи з диханням, тілом і звуком.' },
    { n: 4, t: 'Отримуєш результат',               d: 'Голос стає живим, тіло розслабленим, з’являється впевненість.' },
  ];
  return (
    <section className="tv-section tv-how">
      <window.SectionHead
        idx={5}
        eyebrow="Як це працює · процес"
        title={<>Чотири кроки —<br className="tv-hide-narrow"/> і ти на іншому боці.</>}
        max="38ch"
      />
      <ol className="tv-how-list">
        {steps.map((s, i) => (
          <li key={s.n} className="tv-how-step">
            <div className="num-wrap">
              <span className="num">{s.n}</span>
              {i < steps.length - 1 ? <span className="conn" aria-hidden="true"/> : null}
            </div>
            <div className="body">
              <h3 className="tv-h3">{s.t}</h3>
              <p className="tv-body">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="tv-how-cta">
        <button className="tv-btn tv-btn--big" onClick={onApply}>
          Забрати від&nbsp;15$ <span className="arrow">→</span>
        </button>
        <span className="tv-small">14 днів гарантії · 7 місяців доступу · Telegram-бот</span>
      </div>
    </section>
  );
}

Object.assign(window, { Method, Founder, Program, HowItWorks });
