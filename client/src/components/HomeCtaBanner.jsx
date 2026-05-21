import { Highlight } from './brand.jsx';
import cardTexture from '../assets/card-texture.png';
import ctaVisual from '../assets/cta-banner.png';

export default function HomeCtaBanner() {
  return (
    <section className="cta-section">
      <div
        className="cta-stamp-banner mx-auto max-w-7xl"
        style={{
          backgroundImage: `url(${cardTexture})`,
        }}
      >
        <div className="cta-stamp-banner__grid">
          <div className="cta-stamp-banner__content">
            <h2 className="text-3xl font-extrabold leading-tight tracking-tightish text-ia-ink sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
              Ready to meet the <Highlight>cohort?</Highlight>
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ia-muted">
              Browse the cohort and book your first founder call.
            </p>
            <a href="/#featured" className="btn-primary mt-8 inline-flex">
              Explore Startups →
            </a>
          </div>

          <div className="cta-stamp-banner__visual hidden lg:flex" aria-hidden>
            <img
              src={ctaVisual}
              alt=""
              className="cta-stamp-banner__visual-img"
              width={280}
              height={230}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
