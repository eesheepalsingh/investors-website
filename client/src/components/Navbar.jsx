import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { IALogo } from './brand.jsx';

const PUBLIC_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/startups', label: 'Startups' },
];

export default function Navbar({ variant = 'public' }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const onSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ia-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link to="/" className="shrink-0">
          <IALogo />
        </Link>

        {variant === 'public' ? (
          <>
            <nav className="hidden items-center gap-7 md:flex">
              {PUBLIC_LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'nav-link-active' : ''}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <a
                href="https://indiaaccelerator.co"
                target="_blank"
                rel="noreferrer"
                className="nav-link"
              >
                About IA
              </a>
            </nav>

            <div className="hidden md:block">
              <Link to="/startups" className="btn-apply">
                Explore Startups
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="rounded-md p-2 text-ia-ink hover:bg-ia-cream md:hidden"
              aria-label="Toggle menu"
            >
              <Burger open={open} />
            </button>
          </>
        ) : (
          <nav className="flex items-center gap-3">
            {user && (
              <>
                <span className="hidden text-xs text-ia-muted sm:inline">
                  {user.email}
                </span>
                <Link to="/admin/dashboard" className="nav-link">
                  Dashboard
                </Link>
                <button type="button" onClick={onSignOut} className="btn-secondary">
                  Sign out
                </button>
              </>
            )}
          </nav>
        )}
      </div>

      {variant === 'public' && open && (
        <div className="border-t border-ia-line bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {PUBLIC_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-semibold uppercase tracking-[0.14em] ${
                    isActive ? 'text-ia-ink font-bold' : 'text-ia-ink/85'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <a
              href="https://indiaaccelerator.co"
              target="_blank"
              rel="noreferrer"
              className="rounded-md px-3 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-ia-ink/85"
            >
              About IA
            </a>
            <Link
              to="/startups"
              onClick={() => setOpen(false)}
              className="btn-apply mt-2 self-start"
            >
              Explore Startups
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Burger({ open }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
