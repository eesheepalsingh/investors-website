/** Frontend-only placeholders to fill the home featured row when fewer than 3 real startups exist. */
const CARD_IMAGE = (id, w = 800, h = 480) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const FEATURED_DUMMY_STARTUPS = [
  {
    id: 'placeholder-novahealth',
    name: 'NovaHealth AI',
    sector: 'HealthTech',
    stage: 'Seed',
    description:
      'AI-powered diagnostics for tier-2 clinics — faster reports, lower operational cost, and better patient outcomes.',
    logo_url: CARD_IMAGE('photo-1576091160399-112ba8d25d1f'),
    calendly_url: '',
    is_placeholder: true,
  },
  {
    id: 'placeholder-greengrid',
    name: 'GreenGrid Energy',
    sector: 'ClimateTech',
    stage: 'Series A',
    description:
      'Smart microgrids for commercial buildings — real-time load balancing that cuts energy spend by up to 30%.',
    logo_url: CARD_IMAGE('photo-1509391366360-2e959784a276'),
    calendly_url: '',
    is_placeholder: true,
  },
];

export function withFeaturedPlaceholders(startups, minCount = 3) {
  const real = startups.slice(0, 6);
  if (real.length >= minCount) return real;
  const merged = [...real];
  for (const dummy of FEATURED_DUMMY_STARTUPS) {
    if (merged.length >= minCount) break;
    merged.push(dummy);
  }
  return merged;
}
