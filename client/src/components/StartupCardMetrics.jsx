import { getCardMetricBoxes } from '../lib/startupMetrics.js';

export default function StartupCardMetrics({ startup }) {
  const boxes = getCardMetricBoxes(startup, 4);
  if (!boxes.length) return null;

  return (
    <div className="startup-card__metrics" aria-label="Key metrics">
      {boxes.map((box, i) => (
        <div
          key={`${box.label}-${box.value}-${i}`}
          className="startup-card__metric"
        >
          {box.label ? (
            <p className="startup-card__metric-label">{box.label}</p>
          ) : null}
          {box.value ? (
            <p className="startup-card__metric-value">{box.value}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
