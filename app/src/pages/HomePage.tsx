import { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWaveCanvas } from '../hooks/useWaveCanvas';
import { useScrollFan } from '../hooks/useScrollFan';
import { useMorphLoop } from '../hooks/useMorphLoop';
import { asset } from '../lib/asset';
import './HomePage.css';

// Словарь страницы (см. PRODUCT.md): «картинка» — то, что приносит человек,
// «принт» — то, что напечатано, «дизайн» — готовый шаблон из каталога.
// Раньше эти три вещи назывались «макет», «мокап», «образ» и «дизайн»
// вперемешку — покупатель с фото в галерее таких слов не знает.
const services = [
  {
    n: '01',
    title: 'Своя картинка',
    desc: 'Загрузи фото или мем прямо с телефона и посмотри, как он сядет на футболку. Понравится — печатаем.',
    to: '/constructor',
    bg: 'var(--pf-bg-raised)',
    fg: 'var(--pf-text)',
  },
  {
    n: '02',
    title: 'Готовые дизайны',
    desc: 'Своей картинки нет? Возьми готовый дизайн и подставь в него своё фото или надпись.',
    to: '/catalog',
    bg: 'var(--pf-accent)',
    fg: '#0B0B0C',
  },
  {
    n: '03',
    title: 'Соберём за тебя',
    desc: 'Есть идея, но нет картинки? Опиши словами — дизайнер нарисует и покажет на футболке до печати.',
    to: '/catalog',
    bg: 'var(--pf-bg-raised)',
    fg: 'var(--pf-text)',
  },
];

// ЗАГЛУШКА. Настоящую цену нужно взять у заказчика — здесь она в одном месте
// и попадает в липкую панель заказа. Без цены первая ступень лестницы
// убеждения («это недорого и можно одну штуку») на странице не отвечена.
const PRICE_FROM = '1 490 ₽';

// Один источник для цифр: на мобильном они стоят на первом экране
// (.hero-brief), на десктопе — отдельной секцией ниже.
const stats = [
  { value: '24 часа', label: 'с той минуты, как ты одобрил картинку', accent: false },
  { value: 'от 1 шт', label: 'да, серьёзно — одну тоже печатаем', accent: true },
  { value: '50+ стирок', label: 'принт не трескается и не выцветает', accent: false },
];

// мемы для петли «фото → футболка» под кнопкой; расписание — в useMorphLoop
const morphPrints = [asset('assets/morph-print-1.jpg'), asset('assets/morph-print-2.jpg'), asset('assets/morph-print-3.jpg')];

const news = [
  { title: 'Открыли доставку по всей России от 2 дней', date: '28 июня 2026' },
  { title: '−20% на вторую футболку до конца июля', date: '15 июня 2026' },
  { title: 'Как из обычного фото получается принт', date: '2 июня 2026' },
];

// resting position/rotation + off-screen starting offset for each card,
// ported 1:1 from desktop.html's fanConfig
const newsFan = [
  { left: '1%', top: '90px', rot: -5, fromX: -180, fromY: 40 },
  { left: '28%', top: '20px', rot: 3, fromX: 180, fromY: 40 },
  { left: '55%', top: '180px', rot: -2, fromX: 0, fromY: 160 },
];

interface NewsCardProps {
  news: { title: string; date: string };
  fan: (typeof newsFan)[number];
  visible: boolean;
  zIndex: number;
}

// the desktop fan (cards pinned + rotated in from the sides as you scroll)
// has no horizontal room on a single mobile column — below 900px these same
// cards become a swipe carousel instead (see HomePage.css), where the fan's
// visibility state doesn't apply
function NewsCard({ news, fan, visible, zIndex }: NewsCardProps) {
  return (
    <a
      href="#news"
      className="pf-news-card"
      style={{
        left: fan.left,
        top: fan.top,
        zIndex,
        opacity: visible ? 1 : 0,
        transform: visible ? `rotate(${fan.rot}deg) translate(0,0)` : `rotate(0deg) translate(${fan.fromX}px, ${fan.fromY}px)`,
      }}
    >
      <div className="pf-news-card__thumb" />
      <div>
        <div className="pf-news-card__title">{news.title}</div>
        <div className="pf-news-card__date">{news.date}</div>
      </div>
    </a>
  );
}

export function HomePage() {
  const waveRef = useRef<HTMLCanvasElement>(null);
  useWaveCanvas(waveRef, { color: '#FF5C38', speed: 1.9 });
  const morphRef = useRef<HTMLDivElement>(null);
  useMorphLoop(morphRef);

  // липкая панель заказа появляется, когда герой с кнопкой уходит за экран,
  // иначе действовать после первого экрана нечем. Если IntersectionObserver
  // не отработает, панель просто не покажется — кнопка в герое остаётся,
  // и ни один контент не пропадает (в отличие от прежнего reveal через opacity)
  const heroRef = useRef<HTMLDivElement>(null);
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const { ref: newsWrapRef, visible: newsVisible } = useScrollFan([-350, 550, 900]);

  return (
    <div>
      {/* герой + футболка держатся в один экран (см. .hero-screen в HomePage.css),
          чтобы «Ноль шаблонов…» начинался строго за краем первого экрана */}
      <div className="hero-screen" ref={heroRef}>
      {/* волна общая на весь первый экран, а не только на герой: иначе между
          текстом и футболкой оставался мёртвый стык, где она обрывалась */}
      <canvas ref={waveRef} className="hero__wave" />
      <div className="hero">
        <img src={asset('assets/childhood-photos-2.png')} alt="" className="hero__photo" />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(11,11,12,.55) 0%, rgba(11,11,12,0) 55%)',
          }}
        />
        <div className="hero__content">
          <h1 className="hero__title">
            <span>Твой принт —</span>
            {/* не "outline": так называется утилита Tailwind, и она дорисовывала
                странице настоящую рамку вокруг строки */}
            <span className="hero__title-stroke">Твои правила.</span>
          </h1>
          <Link to="/constructor" className="hero__cta">
            Создать принт
          </Link>
        </div>
      </div>

      {/* "фото → футболка": мем уменьшается и ложится принтом на грудь.
          Декоративная петля, поэтому aria-hidden. Живёт под .hero, а не внутри:
          высота волны в герое (.hero__wave) откалибрована под его контент. */}
      <div className="pf-morph pf-mob" ref={morphRef} aria-hidden="true">
        <div className="pf-morph__stage">
          <img src={asset('assets/morph-tee.png')} alt="" className="pf-morph__tee" />
          {morphPrints.map((src) => (
            <img key={src} src={src} alt="" className="pf-morph__print" decoding="async" />
          ))}
        </div>
      </div>
      {/* Плотный низ первого экрана: короткое описание, цифры и действие —
          вместо «слоган + картинка и всё остальное вниз». Только мобильный:
          на десктопе то же самое живёт отдельными секциями (.hero-intro,
          .stats-row), которые ниже скрыты через .pf-mob-hide. */}
      <div className="hero-brief pf-mob">
        <p className="hero-brief__lede">
          Печатаем твоё фото, мем или рисунок на футболке. Одна штука — уже заказ: минимального тиража нет. Своё
          производство в Казани, доставка по России.
        </p>
        <div className="hero-brief__stats">
          {stats.map((s) => (
            <div key={s.value} className="hero-brief__stat">
              <span className={`hero-brief__value${s.accent ? ' hero-brief__value--accent' : ''}`}>{s.value}</span>
              <span className="hero-brief__label">{s.label}</span>
            </div>
          ))}
        </div>
        <Link to="/constructor" className="hero-brief__cta">
          Создать принт →
        </Link>
      </div>
      </div>

      <div className="section hero-intro pf-mob-hide">
        {/* кикеры несут первую ступень лестницы убеждения («не страшно»),
            а не служебный ярлык вроде «01 О сервисе» */}
        <div className="reveal sec-kicker pf-mob">Одна футболка — уже заказ</div>
        <div className="reveal two-col">
          <h2 className="intro__title">Кидай фото — остальное наша забота</h2>
          <p className="intro__text">
            Мем, детская фотография, рисунок ребёнка, кадр из отпуска — подойдёт что угодно. Минимального тиража нет:
            одна футболка для себя — обычный заказ. Перед печатью покажем, как всё будет выглядеть на вещи. Печатаем
            сами, в Казани, привозим по России.
          </p>
        </div>
      </div>

      <div className="section services-section">
        <div className="reveal sec-kicker pf-mob">Три пути к своему принту</div>
        <div className="reveal-stagger services-grid">
          {services.map((s) => (
            <Link key={s.n} to={s.to} className="service-tile" style={{ background: s.bg, color: s.fg }}>
              <div className="service-tile__desc">{s.desc}</div>
              <div className="service-tile__foot">
                <div className="service-tile__num">{s.n}</div>
                <div className="service-tile__row">
                  <div className="service-tile__title">{s.title}</div>
                  <div
                    className="service-tile__arrow"
                    style={{ borderColor: s.fg === '#0B0B0C' ? 'rgba(11,11,12,.3)' : 'rgba(255,255,255,.2)' }}
                  >
                    →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="section pf-mob-hide">
        <div className="reveal-stagger stats-row">
          {stats.map((s, i) => (
            <Fragment key={s.value}>
              {i > 0 && <div className="divider" />}
              <div className={`stat${i === 1 ? ' stat--center' : ''}${i === 2 ? ' stat--right' : ''}`}>
                <div className={`stat__value${s.accent ? ' stat__value--accent' : ''}`}>{s.value}</div>
                <div className="stat__label">{s.label}</div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>

      <div className="section" id="news">
        <div className="news-block">
          <div className="reveal news-head">
            {/* кикер «Новости» снят: заголовок говорит то же самое, а повторять
                одно и то же дважды подряд незачем */}
            <div className="news-title">Что у нас нового</div>
          </div>
          <div ref={newsWrapRef} className="pf-news-wrap">
            <div className="pf-news-sticky">
              {news.map((n, i) => (
                <NewsCard key={n.title} news={n} fan={newsFan[i]} visible={newsVisible[i]} zIndex={i + 1} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Link
        to="/constructor"
        className={`pf-stickycta pf-mob${pastHero ? ' pf-stickycta--in' : ''}`}
        aria-hidden={!pastHero}
        tabIndex={pastHero ? undefined : -1}
      >
        <span className="pf-stickycta__price">
          Футболка с твоим принтом
          <b>от {PRICE_FROM}</b>
        </span>
        <span className="pf-stickycta__btn">Создать принт →</span>
      </Link>
    </div>
  );
}
