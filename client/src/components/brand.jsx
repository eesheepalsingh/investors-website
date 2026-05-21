// Brand primitives — red highlighter & accent asterisk, numbered circle,
// IA logo, decorative dividers. Kept in one file because they're tiny.

import iaLogo from '../assets/ia-logo.png';
import footerLogo from '../assets/footer-logo.avif';

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

/**
 * India Accelerator logo.
 * @param {'dark' | 'light'} theme — dark = header logo; light = footer logo (transparent, white)
 */
export function IALogo({ className = '', theme = 'dark', size = 'default' }) {
  const src = theme === 'light' ? footerLogo : iaLogo;
  const imgClass =
    size === 'header'
      ? 'h-[3.25rem] w-auto max-w-[300px] object-contain object-left sm:h-14'
      : 'h-11 w-auto max-w-[280px] object-contain object-left sm:h-12';

  return (
    <span className={`inline-flex items-center ${className}`}>
      <img
        src={src}
        alt="India Accelerator"
        className={imgClass}
        width={300}
        height={52}
      />
    </span>
  );
}

export function Spinner({ className = 'h-6 w-6' }) {
  return (
    <span
      className={`ia-spin inline-block rounded-full border-2 border-ia-line border-t-ia-brand ${className}`}
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
