import { IALogo, Asterisk } from './brand.jsx';

export default function Footer() {
  return (
    <footer className="border-t border-ia-line bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <IALogo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ia-muted">
              India's leading multi-stage, fund-led startup accelerator — empowering
              founders at every stage.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-ia-muted">
              Investor Portal
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-ia-ink">
              <li><a href="/startups" className="hover:text-ia-orange">Browse startups</a></li>
              <li><a href="https://indiaaccelerator.co" target="_blank" rel="noreferrer" className="hover:text-ia-orange">indiaaccelerator.co</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-ia-muted">
              Contact
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-ia-ink">
              <li>team@indiaaccelerator.co</li>
              <li>Gurugram, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-ia-line pt-6 text-xs text-ia-muted sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Asterisk size={14} />
            <span>© {new Date().getFullYear()} India Accelerator. All rights reserved.</span>
          </div>
          <span>Awarded "Best Accelerator of India" by the Government of India, 2022.</span>
        </div>
      </div>
    </footer>
  );
}
