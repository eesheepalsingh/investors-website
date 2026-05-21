import { IALogo, Asterisk } from './brand.jsx';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ia-ink text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <IALogo theme="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
              India's leading multi-stage, fund-led startup accelerator — empowering
              founders at every stage.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Investor Portal
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              <li>
                <a href="/#featured" className="transition hover:text-white">
                  Browse startups
                </a>
              </li>
              <li>
                <a
                  href="https://indiaaccelerator.co"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white"
                >
                  indiaaccelerator.co
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Contact
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              <li>team@indiaaccelerator.co</li>
              <li>Gurugram, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Asterisk size={14} className="text-ia-brand" />
            <span>© {new Date().getFullYear()} India Accelerator. All rights reserved.</span>
          </div>
          <span>Awarded &quot;Best Accelerator of India&quot; by the Government of India, 2022.</span>
        </div>
      </div>
    </footer>
  );
}
