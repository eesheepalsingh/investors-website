// Brand primitives — yellow highlighter, orange asterisk, numbered circle,
// IA logo, decorative dividers. Kept in one file because they're tiny.

export function Highlight({ children, className = '' }) {
  return <span className={`hl ${className}`}>{children}</span>;
}

export function Asterisk({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={className}
      style={{ color: '#e8451e' }}
    >
      <g fill="currentColor">
        <rect x="14.5" y="2" width="3" height="28" rx="1.5" />
        <rect
          x="14.5"
          y="2"
          width="3"
          height="28"
          rx="1.5"
          transform="rotate(60 16 16)"
        />
        <rect
          x="14.5"
          y="2"
          width="3"
          height="28"
          rx="1.5"
          transform="rotate(120 16 16)"
        />
      </g>
    </svg>
  );
}

export function NumberCircle({ n }) {
  const s = String(n).padStart(2, '0');
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ia-ink text-xs font-bold text-white">
      {s}
    </span>
  );
}

export function IALogo({ withWordmark = true, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-md bg-ia-ink text-white">
        <span className="text-base font-black leading-none">
          i<span className="text-ia-orange">A</span>
        </span>
      </span>
      {withWordmark && (
        <span className="text-sm font-bold uppercase tracking-[0.18em] text-ia-ink">
          India <span className="font-medium">Accelerator</span>
        </span>
      )}
    </span>
  );
}

export function Spinner({ className = 'h-6 w-6' }) {
  return (
    <span
      className={`ia-spin inline-block rounded-full border-2 border-ia-line border-t-ia-orange ${className}`}
    />
  );
}

export function SectionEyebrow({ children }) {
  return (
    <span className="section-eyebrow">
      <Asterisk size={16} />
      {children}
    </span>
  );
}
