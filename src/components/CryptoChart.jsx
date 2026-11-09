import { Line } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { ErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';
import { TIMEFRAMES } from '../api/coingecko.js';
import { formatCompactCurrency, formatPrice, LOCALE } from '../lib/format.js';

// Register only what a filled line chart needs (chart.js/auto pulled in
// every chart type).
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip
);

const timeFormat = new Intl.DateTimeFormat(LOCALE, {
  hour: 'numeric',
  minute: '2-digit',
});
const dayFormat = new Intl.DateTimeFormat(LOCALE, {
  month: 'short',
  day: 'numeric',
});
const monthFormat = new Intl.DateTimeFormat(LOCALE, {
  month: 'short',
  year: 'numeric',
});

export function timeLabel(time, days) {
  if (days <= 1) return timeFormat.format(time);
  if (days <= 90) return dayFormat.format(time);
  return monthFormat.format(time);
}

export function chartSummary(points, { coinName, days, currency }) {
  const label = TIMEFRAMES.find(t => t.days === days)?.label ?? `${days} days`;
  const prices = points.map(point => point.price);
  const first = formatPrice(prices[0], currency);
  const last = formatPrice(prices.at(-1), currency);
  const low = formatPrice(Math.min(...prices), currency);
  const high = formatPrice(Math.max(...prices), currency);
  return `${coinName} price, last ${label.toLowerCase()}: from ${first} to ${last}, low ${low}, high ${high}.`;
}

function axisPrice(value, currency) {
  return Math.abs(value) >= 1000
    ? formatCompactCurrency(value, currency)
    : formatPrice(value, currency);
}

function prefersReducedMotion() {
  return Boolean(
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

function CryptoChart({ points, days, currency, coinName }) {
  if (points.length === 0) {
    return (
      <Wrapper>
        <p>No price data for this period.</p>
      </Wrapper>
    );
  }
  const summary = chartSummary(points, { coinName, days, currency });
  return (
    <Wrapper>
      <ErrorBoundary
        fallback={<p role="alert">The chart could not be drawn.</p>}
      >
        <Line
          role="img"
          aria-label={summary}
          fallbackContent={<p>{summary}</p>}
          data={{
            labels: points.map(point => timeLabel(point.time, days)),
            datasets: [
              {
                label: `${coinName} price`,
                data: points.map(point => point.price),
                fill: true,
                backgroundColor: '#88A6E7',
                borderColor: '#2F66F6',
                pointRadius: 0,
                borderWidth: 2,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            animation: prefersReducedMotion() ? false : { duration: 600 },
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: context => formatPrice(context.parsed.y, currency),
                },
              },
            },
            scales: {
              x: { ticks: { maxTicksLimit: 6, maxRotation: 0 } },
              y: {
                ticks: {
                  maxTicksLimit: 6,
                  callback: value => axisPrice(value, currency),
                },
              },
            },
          }}
        />
      </ErrorBoundary>
    </Wrapper>
  );
}

export default CryptoChart;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 270px;
  width: 100%;
  margin-top: 10px;
  padding: 8px 8px 12px;
  background-color: white;
  box-shadow:
    0px 3px 8px rgba(78, 84, 126, 0.02),
    0px 6px 16px rgba(78, 84, 126, 0.04),
    0px 11px 24px rgba(78, 84, 126, 0.02);
  border-radius: 10px;
  @media (min-width: 600px) {
    height: 320px;
  }
`;
