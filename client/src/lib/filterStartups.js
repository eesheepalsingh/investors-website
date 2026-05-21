/** Split "FinTech, AI" into individual filter tags. */
export function splitFilterTags(value = '') {
  return value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

function formatTag(tag) {
  return tag
    .trim()
    .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export function normalizeStage(stage) {
  const s = stage.trim();
  if (!s) return s;
  return s
    .split(/[\s-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('-');
}

function tagsMatchAny(fieldValue, selectedList) {
  if (!selectedList?.length) return true;
  const tags = splitFilterTags(fieldValue).map((t) => t.toLowerCase());
  return selectedList.some((sel) => tags.includes(sel.toLowerCase()));
}

function stageMatches(stage, selectedStages) {
  if (!selectedStages?.length) return true;
  const normalized = normalizeStage(stage || '');
  return selectedStages.some((sel) => normalizeStage(sel) === normalized);
}

/** Client-side search + multi-select sector/stage filters. */
export function filterStartups(startups, { q = '', sectors = [], stages = [] } = {}) {
  const query = q.trim().toLowerCase();

  return startups.filter((s) => {
    if (!tagsMatchAny(s.sector, sectors)) return false;
    if (!stageMatches(s.stage, stages)) return false;
    if (query) {
      const haystack = `${s.name} ${s.description || ''} ${s.sector || ''} ${s.stage || ''}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function startupFilterOptions(startups) {
  const sectorMap = new Map();
  const stageMap = new Map();

  for (const s of startups) {
    splitFilterTags(s.sector).forEach((tag) => {
      const key = tag.toLowerCase();
      if (!sectorMap.has(key)) sectorMap.set(key, formatTag(tag));
    });
    if (s.stage?.trim()) {
      const norm = normalizeStage(s.stage);
      const key = norm.toLowerCase();
      if (!stageMap.has(key)) stageMap.set(key, norm);
    }
  }

  return {
    sectors: Array.from(sectorMap.values()).sort((a, b) => a.localeCompare(b)),
    stages: Array.from(stageMap.values()).sort((a, b) => a.localeCompare(b)),
  };
}

/** Count active filter controls for the badge. */
export function countActiveFilters({ q = '', sectors = [], stages = [] } = {}) {
  return (q.trim() ? 1 : 0) + sectors.length + stages.length;
}
