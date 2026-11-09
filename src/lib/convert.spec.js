import { describe, expect, it } from 'vitest';
import { convertAmount, MAX_AMOUNT, parseAmount } from './convert.js';

describe('parseAmount', () => {
  it.each([
    ['1', 1],
    ['1.5', 1.5],
    ['1,5', 1.5],
    ['.5', 0.5],
    ['2.', 2],
    [' 23 ', 23],
  ])('reads %j as %d', (text, value) => {
    expect(parseAmount(text)).toEqual({ value, error: null });
  });

  it('treats an empty field as "no amount yet", not as 0', () => {
    expect(parseAmount('')).toEqual({ value: null, error: null });
    expect(parseAmount('   ')).toEqual({ value: null, error: null });
  });

  it.each(['-5', 'abc', '1e3', '0x10', '1.2.3', 'Infinity', '1 000'])(
    'rejects %j',
    text => {
      const result = parseAmount(text);
      expect(result.value).toBeNull();
      expect(result.error).toMatch(/positive number/);
    }
  );

  it('rejects zero and absurd amounts', () => {
    expect(parseAmount('0').error).toMatch(/greater than 0/);
    expect(parseAmount(String(MAX_AMOUNT * 10)).error).toMatch(/too large/);
  });
});

describe('convertAmount', () => {
  it('converts through the shared quote currency', () => {
    expect(convertAmount(1, 66433, 1891.8)).toBeCloseTo(35.1162913, 6);
    expect(convertAmount(2, 1, 1)).toBe(2);
  });

  it('returns null instead of inventing a number', () => {
    expect(convertAmount(1, null, 1)).toBeNull();
    expect(convertAmount(1, 1, 0)).toBeNull();
    expect(convertAmount(null, 1, 1)).toBeNull();
    expect(convertAmount(1, NaN, 1)).toBeNull();
    expect(convertAmount(-1, 1, 1)).toBeNull();
  });
});
