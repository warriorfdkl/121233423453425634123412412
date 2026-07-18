import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePrintScene, GARMENT_VIEW_ANGLES } from '../hooks/usePrintScene';
import { useLayers } from '../hooks/useLayers';
import { useFlyToCart } from '../hooks/useFlyToCart';
import { useAppState } from '../context/AppStateContext';
import { CameraIcon } from '../components/icons';
import './ConstructorPage.css';

const colorPresets = ['#EDEDEE', '#141416', '#FF5C38', '#C2410C', '#3B4A8E', '#8C8C90'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const BASE_PRICE_CENTS = 99000;

export function ConstructorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const addToCartBtnRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sceneMode, setSceneMode] = useState<'3d' | '2d'>('3d');
  const [angle, setAngle] = useState<string>('front');
  const [garmentColor, setGarmentColor] = useState('#8C8C90');
  const [size, setSize] = useState('M');
  const [cartMsg, setCartMsg] = useState('');
  const dragState = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const yawDrag = useRef<{ startX: number; startYaw: number } | null>(null);
  const yaw = useRef(0);

  const { layers, activeId, setActiveId, addImage, addText, deleteLayer, moveLayer } = useLayers();
  const { status, setYaw, views } = usePrintScene(canvasRef, { color: garmentColor, layers });
  const { cart, addToCart, cartCount } = useAppState();
  const fly = useFlyToCart();

  const onStagePointerDown = (e: React.PointerEvent) => {
    if (sceneMode !== '3d') return;
    yawDrag.current = { startX: e.clientX, startYaw: yaw.current };
  };
  const onStagePointerMove = (e: React.PointerEvent) => {
    if (!yawDrag.current) return;
    const dx = e.clientX - yawDrag.current.startX;
    yaw.current = yawDrag.current.startYaw + dx * 0.4;
    setYaw(yaw.current);
  };
  const endYawDrag = () => {
    yawDrag.current = null;
  };

  const onLayerPointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setActiveId(id);
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const layer = layers.find((l) => l.id === id);
    if (!layer) return;
    dragState.current = {
      id,
      offsetX: e.clientX - (rect.left + (layer.xPct / 100) * rect.width),
      offsetY: e.clientY - (rect.top + (layer.yPct / 100) * rect.height),
    };
  };
  const onOverlayPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const xPct = ((e.clientX - dragState.current.offsetX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - dragState.current.offsetY - rect.top) / rect.height) * 100;
    moveLayer(dragState.current.id, xPct, yPct);
  };
  const endLayerDrag = () => {
    dragState.current = null;
  };

  const handleAddToCart = () => {
    addToCart(1, size, garmentColor);
    fly(addToCartBtnRef.current, garmentColor);
    setCartMsg('Добавлено в корзину — переходи в корзину, чтобы оформить заказ.');
    setTimeout(() => setCartMsg(''), 4000);
  };

  return (
    <div className="builder">
      <div className="catalog-breadcrumb" style={{ marginBottom: 18 }}>
        <Link to="/">Главная</Link>
        <span>/</span>
        <span style={{ color: 'var(--pf-text-dim-75)' }}>Конструктор</span>
      </div>
      <div className="catalog-title-row" style={{ marginBottom: 28 }}>
        <h1 className="builder__title" style={{ fontWeight: 700, fontSize: 'clamp(28px,3vw,42px)' }}>
          Собери принт за пару кликов
        </h1>
        <p className="builder__subtitle" style={{ maxWidth: '36ch', fontWeight: 300 }}>
          Загрузи фото или текст, выбери цвет и футболку — увидишь готовый принт на 3D-модели за пару секунд.
        </p>
      </div>

      <div className="builder__grid">
        <div>
          <div
            ref={stageRef}
            className="stage"
            onPointerDown={onStagePointerDown}
            onPointerMove={(e) => {
              onStagePointerMove(e);
              onOverlayPointerMove(e);
            }}
            onPointerUp={() => {
              endYawDrag();
              endLayerDrag();
            }}
            onPointerLeave={() => {
              endYawDrag();
              endLayerDrag();
            }}
          >
            <div className="stage__toggle">
              <button type="button" className={sceneMode === '3d' ? 'active' : ''} onClick={() => setSceneMode('3d')}>
                3D
              </button>
              <button type="button" className={sceneMode === '2d' ? 'active' : ''} onClick={() => setSceneMode('2d')}>
                2D
              </button>
            </div>

            <div className="stage__color">
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--pf-text-dim-65)' }}>Цвет</span>
              {colorPresets.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  className="stage__swatch"
                  style={{ background: hex, border: garmentColor === hex ? '2px solid #fff' : '2px solid rgba(255,255,255,.3)' }}
                  aria-label={hex}
                  onClick={() => setGarmentColor(hex)}
                />
              ))}
              <input type="color" value={garmentColor} onChange={(e) => setGarmentColor(e.target.value)} aria-label="Свой цвет" style={{ width: 19, height: 19, padding: 0, border: 'none', background: 'none' }} />
            </div>

            <canvas ref={canvasRef} style={{ display: sceneMode === '3d' ? 'block' : 'none', cursor: 'grab' }} />

            {sceneMode === '2d' && (
              <div className="layer-overlay">
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    // dark garment colors (e.g. near-black) would otherwise
                    // blend into the equally-dark stage background — a thin
                    // rim light plus a grounding shadow keeps the silhouette
                    // readable no matter which swatch is picked
                    filter: 'drop-shadow(0 0 1px rgba(255,255,255,.2)) drop-shadow(0 14px 26px rgba(0,0,0,.5))',
                  }}
                >
                  {/* a real static render of the same 3D model/color, not a
                      flat CSS approximation — see usePrintScene's captureViews.
                      No margin/inset here on purpose: it's the exact same
                      camera framing as the 3D canvas, so the shirt reads at
                      the same scale switching between the two tabs. */}
                  {views[angle] && (
                    <img src={views[angle]} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
                  )}
                </div>
                {/* layer positions are only tuned for the front framing —
                    editing stays there; other angles are read-only preview */}
                {angle === 'front' && (
                  <>
                    {layers.map((l) => (
                      <div
                        key={l.id}
                        className="layer"
                        style={{ left: `${l.xPct}%`, top: `${l.yPct}%`, outline: activeId === l.id ? '2px dashed #FF5C38' : 'none', outlineOffset: 6 }}
                        onPointerDown={(e) => onLayerPointerDown(l.id, e)}
                      >
                        {l.kind === 'image' ? (
                          <img src={l.src} alt="" />
                        ) : (
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: l.fontSize,
                              color: '#fff',
                              whiteSpace: 'nowrap',
                              WebkitTextStroke: '1px rgba(0,0,0,.55)',
                              paintOrder: 'stroke',
                            }}
                          >
                            {l.text}
                          </span>
                        )}
                        {activeId === l.id && (
                          <button type="button" className="layer-remove" onClick={() => deleteLayer(l.id)}>
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    {layers.length === 0 && (
                      <div className="print-hint" aria-hidden>
                        <CameraIcon size={20} color="var(--pf-text-dim-5)" />
                        <div className="print-hint__title">Здесь появится принт</div>
                        <div className="print-hint__sub">Загрузи фото или добавь текст справа</div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {status === 'loading' && sceneMode === '3d' && (
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--pf-text-dim-5)', fontSize: 13 }}>
                Загружаем 3D-модель…
              </div>
            )}
            {status === 'error' && sceneMode === '3d' && (
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--pf-text-dim-5)', fontSize: 13, textAlign: 'center', padding: 24 }}>
                Не удалось загрузить 3D-модель футболки.
              </div>
            )}
          </div>

          {sceneMode === '2d' && (
            <div className="angle-strip">
              {GARMENT_VIEW_ANGLES.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  className={`angle-strip__item ${angle === v.key ? 'active' : ''}`}
                  onClick={() => setAngle(v.key)}
                >
                  {views[v.key] ? <img src={views[v.key]} alt={v.label} /> : <div className="angle-strip__placeholder" />}
                  <span>{v.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="builder__panel">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) addImage(file);
              e.target.value = '';
            }}
          />

          <div className="panel-card">
            <div className="panel-row">
              <div className="panel-col" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="panel-step">
                  <span className="panel-step__num">1</span>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>Изображение</span>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '100%',
                    flex: 1,
                    minHeight: 52,
                    borderRadius: 14,
                    border: '1.5px dashed var(--pf-border-strong)',
                    background: 'rgba(255,255,255,.02)',
                    color: 'var(--pf-text)',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  + Загрузить фото или рисунок
                </button>
              </div>
              <div className="panel-col panel-col--size">
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--pf-text-dim-65)', marginBottom: 12 }}>Размер</div>
                <div className="size-grid size-grid--compact">
                  {sizes.map((s) => (
                    <button key={s} type="button" className={`size-pill ${size === s ? 'active' : ''}`} onClick={() => setSize(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="panel-card">
            <div className="panel-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div className="panel-step" style={{ marginBottom: 0 }}>
                  <span className="panel-step__num">2</span>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>Текст</span>
                </div>
                <button
                  type="button"
                  onClick={() => addText()}
                  style={{
                    height: 34,
                    padding: '0 16px',
                    borderRadius: 10,
                    border: 'none',
                    background: 'linear-gradient(135deg,#FF7A54,#FF5C38)',
                    color: '#0B0B0C',
                    fontWeight: 600,
                    fontSize: 12.5,
                    cursor: 'pointer',
                  }}
                >
                  + Добавить
                </button>
              </div>
              <div style={{ fontSize: 13, color: 'var(--pf-text-dim-5)' }}>Не обязательно — добавь, если нужна надпись</div>
            </div>

            <div className="panel-section">
              <div className="panel-step">
                <span className="panel-step__num">3</span>
                <span style={{ fontWeight: 600, fontSize: 15 }}>Товар</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  height: 44,
                  padding: '0 16px',
                  borderRadius: 12,
                  border: '1px solid var(--pf-accent)',
                  background: 'var(--pf-accent-soft)',
                  color: 'var(--pf-accent)',
                }}
              >
                <span style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>Футболка</span>
                <span style={{ fontSize: 12 }}>990 ₽</span>
              </div>
            </div>
          </div>

          <div className="checkout-bar">
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: 'rgba(11,11,12,.6)' }}>
                Итого
              </div>
              <div style={{ fontWeight: 700, fontSize: 30, color: '#0B0B0C', letterSpacing: '-.02em' }}>
                {(BASE_PRICE_CENTS / 100).toLocaleString('ru-RU')} ₽
              </div>
            </div>
            <button ref={addToCartBtnRef} type="button" onClick={handleAddToCart}>
              В корзину
            </button>
          </div>
          {cartMsg && (
            <div style={{ fontSize: 13.5, color: 'var(--pf-text-dim-65)', textAlign: 'center' }}>{cartMsg}</div>
          )}
          {cartCount > 0 && (
            <div style={{ fontSize: 12, color: 'var(--pf-text-dim-5)', textAlign: 'center' }}>
              В корзине: {cart.length} {cart.length === 1 ? 'позиция' : 'позиции'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
