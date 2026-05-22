const CARD_METRIC_BOX_LIMIT = 4;

/**
 * Card metric boxes from admin `metrics_list`.
 * Each row → one box: label (1st input) on top, value (2nd input) below.
 */
export function getCardMetricBoxes(startup, limit = CARD_METRIC_BOX_LIMIT) {
  if (!Array.isArray(startup?.metrics_list)) return [];

  const boxes = [];

  for (const m of startup.metrics_list) {
    const label = String(m?.label ?? '').trim();
    const value = String(m?.value ?? '').trim();
    if (!label && !value) continue;

    boxes.push({ label, value });
    if (boxes.length >= limit) break;
  }

  return boxes;
}
