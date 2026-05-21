import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/axios.js';
import {
  countActiveFilters,
  filterStartups,
  startupFilterOptions,
} from '../lib/filterStartups.js';
import FeaturedStartupSlider from '../components/FeaturedStartupSlider.jsx';
import StartupFilters from '../components/StartupFilters.jsx';
import HomeHeroShowcase from '../components/HomeHeroShowcase.jsx';
import HeroHighlights from '../components/HeroHighlights.jsx';
import {
  Asterisk,
  Highlight,
  SectionEyebrow,
} from '../components/brand.jsx';
import StepStampCard from '../components/StepStampCard.jsx';
import HomeCtaBanner from '../components/HomeCtaBanner.jsx';
import { StartupCardSkeletonGrid } from '../components/skeleton/StartupCardSkeleton.jsx';

const HERO_HIGHLIGHTS = [
  'Curated Virtual Showcase',
  '100+ Investors',
  'Exclusive 1:1 Meetings',
  'Handpicked Portfolio',
];

export default function Home() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [selectedStages, setSelectedStages] = useState([]);
  const [q, setQ] = useState('');

  const { sectors, stages } = useMemo(() => startupFilterOptions(startups), [startups]);
  const filtered = useMemo(
    () => filterStartups(startups, { q, sectors: selectedSectors, stages: selectedStages }),
    [startups, q, selectedSectors, selectedStages]
  );
  const activeFilterCount = useMemo(
    () => countActiveFilters({ q, sectors: selectedSectors, stages: selectedStages }),
    [q, selectedSectors, selectedStages]
  );

  const resetFilters = () => {
    setSelectedSectors([]);
    setSelectedStages([]);
    setQ('');
  };

  useEffect(() => {
    let alive = true;
    api
      .get('/startups')
      .then(({ data }) => alive && setStartups(data))
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero-section relative border-b border-ia-line">
        <div className="hero-section__glow hero-section__glow--red" aria-hidden />
        <div className="hero-section__glow hero-section__glow--soft" aria-hidden />

        <div className="relative mx-auto max-w-7xl min-w-0 px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-20 lg:pt-24">
          <div className="grid min-w-0 items-center gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
            <div className="hero-content min-w-0">
              <SectionEyebrow>Investor portal</SectionEyebrow>
              <h1 className="hero-content__title">
                Meet the next wave of{' '}
                <Highlight>India's boldest founders</Highlight>.
              </h1>
              <p className="hero-content__lead">
                Curated startups from India Accelerator's latest cohort. Explore
                traction, view pitch decks, and book 1:1 time with founders —
                all in one place.
              </p>
              <div className="hero-content__actions">
                <a href="#featured" className="btn-primary">
                  Explore Startups →
                </a>
                <a
                  href="https://indiaaccelerator.co"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  <span className="sm:hidden">About IA</span>
                  <span className="hidden sm:inline">About India Accelerator</span>
                </a>
              </div>
              <HeroHighlights items={HERO_HIGHLIGHTS} />
            </div>

            <HomeHeroShowcase startups={startups} />
          </div>
        </div>
      </section>

      {/* FEATURED STARTUPS */}
      <section id="featured" className="border-b border-ia-line bg-white scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="mb-10">
            <SectionEyebrow>Featured</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tightish sm:text-5xl">
              Startups we're <Highlight>proud to back</Highlight>.
            </h2>
            <p className="mt-3 max-w-lg text-base text-ia-muted">
              Hand-picked from the latest cohort — traction, decks, and founder
              access in one click.
            </p>
          </div>

          {loading && <StartupCardSkeletonGrid count={3} />}
          {error && <ErrorBlock message={error} />}
          {!loading && !error && (
            <div className="featured-cohort w-full">
              <StartupFilters
                q={q}
                selectedSectors={selectedSectors}
                selectedStages={selectedStages}
                sectorOptions={sectors}
                stageOptions={stages}
                onQChange={setQ}
                onSectorsChange={setSelectedSectors}
                onStagesChange={setSelectedStages}
                onReset={resetFilters}
                activeCount={activeFilterCount}
              />
              {activeFilterCount > 0 && (
                <p className="-mt-4 mb-8 text-sm text-ia-muted">
                  Showing {filtered.length} of {startups.length} startups
                </p>
              )}
              {filtered.length === 0 ? (
                <div className="card mx-auto max-w-md p-10 text-center">
                  <p className="text-ia-muted">No startups match your filters.</p>
                  <button type="button" onClick={resetFilters} className="btn-secondary mt-4">
                    Clear filters
                  </button>
                </div>
              ) : (
                <FeaturedStartupSlider startups={filtered} />
              )}
            </div>
          )}

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b border-ia-line bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="text-center">
            <SectionEyebrow>How it works</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tightish sm:text-5xl">
              Three steps to your next{' '}
              <Highlight>great investment</Highlight>.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-ia-muted">
              From browsing the cohort to booking your first founder call.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-12 px-3 py-2 md:grid-cols-3 md:gap-10">
            <StepStampCard icon="browse" title="Browse the cohort">
              Explore startups by sector and stage. Filter to what matters to you.
            </StepStampCard>
            <StepStampCard icon="dive" title="Dive into a startup">
              Read the story, see the team, scan the pitch deck — all on one page.
            </StepStampCard>
            <StepStampCard icon="book" title="Book a 1:1">
              Pick a time that works on the founder's live Calendly. Done.
            </StepStampCard>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="border-b border-ia-line bg-[#f3f3f3]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionEyebrow>What investors get</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tightish sm:text-5xl">
                Everything you need to make an{' '}
                <Highlight>informed call</Highlight>.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ia-muted">
                Connecting High-Growth Founders with Strategic Capital
              </p>
            </div>

            <div className="space-y-5">
              <ValueProp
                title="Traction at a glance"
                desc="Revenue, stage, ask, and current backers — surfaced upfront on every startup card. No deck downloads required."
              />
              <ValueProp
                title="Direct founder access"
                desc="One click to view pitch decks. One more to book a 1:1 directly on the founder's calendar via Calendly."
              />
              <ValueProp
                title="Curated, not crowded"
                desc="Every startup is hand-picked by IA's investment team. Quality over quantity, always."
              />
            </div>
          </div>
        </div>
      </section>

      <HomeCtaBanner />
    </>
  );
}

function ValueProp({ title, desc }) {
  return (
    <div className="value-prop-card">
      <Asterisk size={24} className="mt-0.5 shrink-0 text-ia-brand" />
      <div>
        <h3 className="text-xl font-bold text-ia-ink sm:text-2xl">{title}</h3>
        <p className="mt-2 text-base leading-relaxed text-ia-muted">{desc}</p>
      </div>
    </div>
  );
}

function ErrorBlock({ message }) {
  return (
    <div className="card border-red-200 bg-red-50 p-6 text-sm text-red-700">
      Failed to load startups: {message}
    </div>
  );
}
