// Converter maths. Prices come from the same CoinGecko answer (one currency,
// one point in time), so converting needs no extra API call per keystroke.

const NUMBER_PATTERN = /^(\d+(\.\d*)?|\.\d+)$/;
export const MAX_AMOUNT = 1e12;

// Parses what the user typed. Accepts "1", "1.5", "1,5", ".5".
export function parseAmount(text) {
  const normalized = String(text ?? '')
    .trim()
    .replace(',', '.');
  if (normalized === '') return { value: null, error: null };
  if (!NUMBER_PATTERN.test(normalized)) {
    return { value: null, error: 'Enter a positive number, for example 1.5.' };
  }
  const value = Number(normalized);
  if (value <= 0) {
    return { value: null, error: 'Enter an amount greater than 0.' };
  }
  if (value > MAX_AMOUNT) {
    return { value: null, error: 'That amount is too large.' };
  }
  return { value, error: null };
}

// amount of `from` expressed in `to`, or null if anything is missing.
export function convertAmount(amount, fromPrice, toPrice) {
  const ok = value => typeof value === 'number' && Number.isFinite(value);
  if (!ok(amount) || !ok(fromPrice) || !ok(toPrice)) return null;
  if (amount < 0 || fromPrice < 0 || toPrice <= 0) return null;
  return (amount * fromPrice) / toPrice;
}
