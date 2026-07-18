import { useLayoutEffect } from 'react';
import gsap from 'gsap';

const PHASE = 7; // секунд на один мем

// у каждого мема своя дуга и наклон — на одинаковой траектории три подряд
// читаются как один и тот же кадр, а не как «любой принт»
const FLIGHT = [
  { x: -16, rot: -9 },
  { x: 14, rot: 7 },
  { x: -5, rot: -4 },
];

/**
 * Петля «мем → футболка» на первом экране: карточка влетает сверху, в момент
 * касания груди становится краской (mix-blend-mode) и получает отдачу — принт
 * сплющивается и отпружинивает, футболка коротко отыгрывает удар.
 *
 * Это единственная анимация главной на GSAP: остальные (появление блоков,
 * маска волны) остались на CSS, потому что там нет ничего, чего бы CSS не
 * умел. Здесь же нужны упругость на приземлении, разные траектории и
 * остановка петли за экраном — на @keyframes это расписание из магических
 * процентов, которое нельзя ни притормозить, ни переиграть.
 */
export function useMorphLoop(rootRef: React.RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    // только мобильный экран: выше 780px .pf-morph скрыт (display: none), гонять
    // таймлайн по невидимым элементам незачем
    mm.add('(max-width: 780px) and (prefers-reduced-motion: no-preference)', () => {
      const prints = Array.from(root.querySelectorAll<HTMLElement>('.pf-morph__print'));
      const tee = root.querySelector<HTMLElement>('.pf-morph__tee');
      if (!prints.length || !tee) return;

      const tl = gsap.timeline({ repeat: -1 });
      // держит длину цикла ровно на всех фазах, даже если последний мем
      // догорает раньше её конца
      tl.to({}, { duration: PHASE * prints.length }, 0);

      prints.forEach((el, i) => {
        const f = FLIGHT[i % FLIGHT.length];
        const at = i * PHASE;
        const touch = at + 1.65; // момент касания ткани

        tl.set(
          el,
          {
            xPercent: -50,
            x: f.x,
            yPercent: -118,
            scale: 1.24,
            rotate: f.rot,
            opacity: 0,
            // в полёте это ещё фотокарточка с белой бумагой и тенью
            mixBlendMode: 'normal',
            filter: 'drop-shadow(0 14px 22px rgba(0,0,0,.6))',
          },
          at,
        )
          .to(el, { opacity: 1, duration: 0.45, ease: 'power1.out' }, at)
          // падение с разгоном к ткани
          .to(el, { yPercent: 0, x: 0, scale: 1, rotate: 0, duration: 1.15, ease: 'power2.in' }, at + 0.5)
          // касание: белая бумага гаснет об ткань, принт получает отдачу
          .set(el, { mixBlendMode: 'multiply', filter: 'none' }, touch)
          // immediateRender: false обязателен — иначе fromTo выставляет
          // начальное состояние ещё при сборке таймлайна, и футболка с
          // принтами висят сплющенными до первого проигрывания
          .fromTo(
            el,
            { scaleX: 1.1, scaleY: 0.9 },
            { scaleX: 1, scaleY: 1, duration: 0.9, ease: 'elastic.out(1, .45)', immediateRender: false },
            touch,
          )
          .fromTo(
            tee,
            { scaleX: 1.025, scaleY: 0.98 },
            { scaleX: 1, scaleY: 1, duration: 1.1, ease: 'elastic.out(1, .4)', immediateRender: false },
            touch,
          )
          .to(el, { opacity: 0, duration: 0.5, ease: 'power1.in' }, at + PHASE - 0.7);
      });

      // за пределами экрана петля не крутится
      const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? tl.resume() : tl.pause()));
      io.observe(root);

      return () => {
        io.disconnect();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, [rootRef]);
}
