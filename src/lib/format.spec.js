import { describe, expect, it } from 'vitest';
import {
  formatAmount,
  formatCompactCurrency,
  formatPercent,
  formatPrice,
  formatPriceChange,
  MISSING,
  trend,
} from './format.js';

describe('formatPrice', () => {
  it.each([null, undefined, NaN, Infinity, '12', {}])(
    'renders %s as a dash instead of throwing',
    value => {
      expect(formatPrice(value, 'eur')).toBe(MISSING);
    }
  );

  it('uses the given currency consistently', () => {
    expect(formatPrice(66433, 'eur')).toBe('€66,433.00');
    expect(formatPrice(66433, 'usd')).toBe('$66,433.00');
  });

  it('keeps sub-cent prices readable instead of 0.00', () => {
    expect(formatPrice(0.00000392, 'eur')).toBe('€0.00000392');
    expect(formatPrice(0.078987, 'eur')).toBe('€0.07899');
    expect(formatPrice(0.5, 'eur')).toBe('€0.50');
  });

  it('formats zero and negative values', () => {
    expect(formatPrice(0, 'eur')).toBe('€0.00');
    expect(formatPrice(-1.5, 'eur')).toBe('-€1.50');
  });
});

describe('formatPriceChange', () => {
  it('shows an explicit sign', () => {
    expect(formatPriceChange(12.3, 'eur')).toBe('+€12.30');
    expect(formatPriceChange(-1345.14, 'eur')).toBe('-€1,345.14');
    expect(formatPriceChange(0, 'eur')).toBe('€0.00');
    expect(formatPriceChange(null, 'eur')).toBe(MISSING);
  });
});

describe('formatCompactCurrency', () => {
  it('abbreviates market caps in the active currency', () => {
    expect(formatCompactCurrency(1335956665055, 'eur')).toBe('€1.34T');
    expect(formatCompactCurrency(null, 'eur')).toBe(MISSING);
  });
});

describe('formatPercent', () => {
  it('formats API percent values with a sign', () => {
    expect(formatPercent(2.12118)).toBe('+2.12%');
    expect(formatPercent(-5.4026)).toBe('-5.40%');
    expect(formatPercent(0)).toBe('0.00%');
    expect(formatPercent(null)).toBe(MISSING);
  });
});

describe('formatAmount', () => {
  it('formats converter results', () => {
    expect(formatAmount(35.07732381648286)).toBe('35.077324');
    expect(formatAmount(0.000123456789)).toBe('0.000123457');
    expect(formatAmount(0)).toBe('0');
    expect(formatAmount(undefined)).toBe(MISSING);
  });
});

describe('trend', () => {
  it('classifies values and refuses to guess for missing ones', () => {
    expect(trend(1)).toBe('up');
    expect(trend(-1)).toBe('down');
    expect(trend(0)).toBe('flat');
    // null >= 0 is true in JavaScript; that comparison caused the 2026 crash.
    expect(trend(null)).toBeNull();
  });
});
