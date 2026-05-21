import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

import { IALogo } from './brand.jsx';



const ABOUT_IA_URL = 'https://indiaaccelerator.co';



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

            <a

              href={ABOUT_IA_URL}

              target="_blank"

              rel="noreferrer"

              className="btn-apply hidden md:inline-flex"

            >

              About IA

            </a>



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

            <a

              href={ABOUT_IA_URL}

              target="_blank"

              rel="noreferrer"

              onClick={() => setOpen(false)}

              className="btn-apply self-start"

            >

              About IA

            </a>

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

