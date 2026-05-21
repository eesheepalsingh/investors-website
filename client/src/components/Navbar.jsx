import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { IALogo } from './brand.jsx';

const ABOUT_IA_URL = 'https://indiaaccelerator.co';

export default function Navbar({ variant = 'public' }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const onSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ia-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <Link to="/" className="min-w-0 shrink">
          <IALogo />
        </Link>

        {variant === 'public' ? (
          <a
            href={ABOUT_IA_URL}
            target="_blank"
            rel="noreferrer"
            className="nav-about-ia shrink-0"
          >
            About IA
          </a>
        ) : (
          <nav className="flex shrink-0 items-center gap-3">
            {user && (
              <>
                <span className="hidden text-xs text-ia-muted sm:inline">{user.email}</span>
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
    </header>
  );
}
