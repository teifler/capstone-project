// Formats a number with fixed decimals and thousands separators.
// API values can be null (for example a coin without 24h data), so anything
// that is not a finite number is shown as a dash instead of crashing the page.
export function formatNumber(value, digits = 2) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '–';
  return value.toFixed(digits).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
