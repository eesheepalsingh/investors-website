function SearchIcon() {
  return (
    <svg
      className="startup-filters__search-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FilterChipRow({ label, hint, values, selected, onToggle, onClear }) {
  const noneSelected = selected.length === 0;

  return (
    <div className="startup-filters__group">
      <div className="startup-filters__group-head">
        <span className="startup-filters__group-label">{label}</span>
        {hint && <span className="startup-filters__group-hint">{hint}</span>}
      </div>
      <div
        className="startup-filters__chips"
        role="group"
        aria-label={`Filter by ${label.toLowerCase()}`}
        tabIndex={0}
      >
        <button
          type="button"
          aria-pressed={noneSelected}
          onClick={onClear}
          className={`filter-chip ${noneSelected ? 'filter-chip--active' : ''}`}
        >
          All
        </button>
        {values.map((value) => {
          const isActive = selected.includes(value);
          return (
            <button
              key={value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onToggle(value)}
              className={`filter-chip ${isActive ? 'filter-chip--active' : ''}`}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function StartupFilters({
  q,
  selectedSectors,
  selectedStages,
  sectorOptions,
  stageOptions,
  onQChange,
  onSectorsChange,
  onStagesChange,
  onReset,
  activeCount,
}) {
  const hasFilters = activeCount > 0;

  const toggleSector = (value) => {
    onSectorsChange(
      selectedSectors.includes(value)
        ? selectedSectors.filter((s) => s !== value)
        : [...selectedSectors, value]
    );
  };

  const toggleStage = (value) => {
    onStagesChange(
      selectedStages.includes(value)
        ? selectedStages.filter((s) => s !== value)
        : [...selectedStages, value]
    );
  };

  return (
    <div className="startup-filters card mb-8 overflow-hidden">
      <div className="startup-filters__header">
        <div>
          <p className="startup-filters__title">Find your next investment</p>
          <p className="startup-filters__subtitle">Search by name or narrow the cohort with filters</p>
        </div>
        <div className="startup-filters__header-actions">
          {hasFilters && (
            <span className="startup-filters__badge">{activeCount} active</span>
          )}
          {hasFilters && (
            <button type="button" onClick={onReset} className="startup-filters__clear">
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="startup-filters__body">
        <div
          className={`startup-filters__row${
            sectorOptions.length && stageOptions.length
              ? ' startup-filters__row--triple'
              : sectorOptions.length || stageOptions.length
                ? ' startup-filters__row--double'
                : ''
          }`}
        >
          <div className="startup-filters__search-cell">
            <div className="startup-filters__group-head">
              <span className="startup-filters__group-label">Search</span>
            </div>
            <label className="startup-filters__search" htmlFor="startup-search">
              <SearchIcon />
              <input
                id="startup-search"
                className="startup-filters__search-input"
                placeholder="Name or description…"
                value={q}
                onChange={(e) => onQChange(e.target.value)}
              />
            </label>
          </div>

          {sectorOptions.length > 0 && (
            <FilterChipRow
              label="Sector"
              hint="Select one or more"
              values={sectorOptions}
              selected={selectedSectors}
              onToggle={toggleSector}
              onClear={() => onSectorsChange([])}
            />
          )}
          {stageOptions.length > 0 && (
            <FilterChipRow
              label="Stage"
              hint="Select one or more"
              values={stageOptions}
              selected={selectedStages}
              onToggle={toggleStage}
              onClear={() => onStagesChange([])}
            />
          )}
        </div>
      </div>
    </div>
  );
}
