import { getCardMetricBoxes } from '../lib/startupMetrics.js';

export default function StartupCardMetrics({ startup }) {
  const boxes = getCardMetricBoxes(startup, 4);
  if (!boxes.length) return null;

  return (
    <div className="startup-card__metrics" aria-label="Key metrics">
      {boxes.map((box, i) => (
        <div
          key={`${box.field}-${i}-${box.text}`}
          className={`startup-card__metric startup-card__metric--${box.field}`}
        >
          <p className="startup-card__metric-text">{box.text}</p>
        </div>
      ))}
    </div>
  );
}
