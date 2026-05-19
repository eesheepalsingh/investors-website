import { useEffect, useRef, useState } from 'react';

function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active || typeof target !== 'number' || target < 0) return;

    let raf;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    setValue(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);

  return value;
}

export default function StatItem({ value, label, barClass, animate = true }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  const isNumber = typeof value === 'number';
  const count = useCountUp(isNumber ? value : 0, visible && animate && isNumber);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const display = !animate || !isNumber ? value : count;

  return (
    <div ref={ref} className="stat-item">
      <div className="stat-item__value tabular-nums">{display}</div>
      <span className={`stat-item__bar ${barClass}`} />
      <p className="stat-item__label">{label}</p>
    </div>
  );
}
