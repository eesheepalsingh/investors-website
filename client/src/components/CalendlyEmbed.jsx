import { useEffect, useRef } from 'react';

export default function CalendlyEmbed({ url }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!url) return;
    const existing = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]'
    );
    if (!existing) {
      const s = document.createElement('script');
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      s.async = true;
      document.body.appendChild(s);
    }
    const link = document.querySelector(
      'link[href="https://assets.calendly.com/assets/external/widget.css"]'
    );
    if (!link) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(l);
    }
  }, [url]);

  if (!url) {
    return (
      <div className="card p-10 text-center text-ia-muted">
        Booking is not configured for this startup yet.
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="calendly-inline-widget overflow-hidden rounded-2xl border border-ia-line bg-white"
      data-url={url}
      style={{ minWidth: '320px', height: '720px' }}
    />
  );
}
