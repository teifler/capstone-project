import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CryptoChart, {
  axisPrice,
  chartSummary,
  timeLabel,
} from './CryptoChart.jsx';
import { parseChart } from '../api/coingecko.js';
import { rawChart } from '../test/fixtures.js';

const points = parseChart(rawChart);
const props = { points, days: 1, currency: 'eur', coinName: 'Bitcoin' };

function chartData() {
  const canvas = screen.getByTestId('price-chart');
  return {
    canvas,
    labels: JSON.parse(canvas.dataset.labels),
    values: JSON.parse(canvas.dataset.values),
    animation: JSON.parse(canvas.dataset.animation),
  };
}

describe('CryptoChart', () => {
  it('draws the price points with a text alternative', () => {
    render(<CryptoChart {...props} />);
    const { canvas, values, labels } = chartData();
    expect(values).toEqual(points.map(p => p.price));
    expect(labels).toHaveLength(points.length);
    expect(canvas).toHaveAttribute('role', 'img');
    expect(canvas).toHaveAccessibleName(
      /^Bitcoin price, last 1 day: from €[\d,.]+ to €[\d,.]+, low €[\d,.]+, high €[\d,.]+\.$/
    );
    // The stray "Chart" text node is gone.
    expect(screen.queryByText('Chart')).toBeNull();
  });

  it('labels the axis by time for one day and by date for longer ranges', () => {
    const time = Date.UTC(2026, 10, 9, 14, 5);
    expect(timeLabel(time, 1)).toMatch(/^\d{1,2}:05 (AM|PM)$/);
    expect(timeLabel(time, 30)).toBe('Nov 9');
    expect(timeLabel(time, 365)).toBe('Nov 2026');
  });

  it('summarises first, last, low and high price', () => {
    const summary = chartSummary(
      [
        { time: 1, price: 10 },
        { time: 2, price: 5 },
        { time: 3, price: 20 },
        { time: 4, price: 12 },
      ],
      { coinName: 'Test', days: 7, currency: 'eur' }
    );
    expect(summary).toBe(
      'Test price, last 7 days: from €10.00 to €12.00, low €5.00, high €20.00.'
    );
  });

  it('turns animation off for visitors who prefer reduced motion', () => {
    vi.stubGlobal('matchMedia', query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
    }));
    render(<CryptoChart {...props} />);
    expect(chartData().animation).toBe(false);
  });

  it('animates briefly otherwise', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    render(<CryptoChart {...props} />);
    expect(chartData().animation).toEqual({ duration: 600 });
  });

  it('says so when there is no data for the period', () => {
    render(<CryptoChart {...props} points={[]} />);
    expect(
      screen.getByText('No price data for this period.')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('price-chart')).toBeNull();
  });
});

describe('axisPrice', () => {
  it('abbreviates large values and keeps small ones precise', () => {
    expect(axisPrice(66000, 'eur')).toBe('€66K');
    expect(axisPrice(950, 'eur')).toBe('€950.00');
    expect(axisPrice(0.0000039, 'eur')).toBe('€0.0000039');
  });
});
