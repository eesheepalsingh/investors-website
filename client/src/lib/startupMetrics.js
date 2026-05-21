const CARD_METRIC_BOX_LIMIT = 4;

/**
 * Card boxes from admin `metrics_list` only.
 * Per row: left input (Label) → one box, right input (Value) → next box. Max 4 boxes total.
 */
export function getCardMetricBoxes(startup, limit = CARD_METRIC_BOX_LIMIT) {
  if (!Array.isArray(startup?.metrics_list)) return [];

  const boxes = [];

  for (const m of startup.metrics_list) {
    const label = String(m?.label ?? '').trim();
    const value = String(m?.value ?? '').trim();

    if (label) {
      boxes.push({ text: label, field: 'label' });
      if (boxes.length >= limit) return boxes.slice(0, limit);
    }
    if (value) {
      boxes.push({ text: value, field: 'value' });
      if (boxes.length >= limit) return boxes.slice(0, limit);
    }
  }

  return boxes.slice(0, limit);
}
