import CryptoChart from './CryptoChart.jsx';
import { parseChart } from '../api/coingecko.js';
import { rawChart } from '../test/fixtures.js';

export default {
  title: 'Components/CryptoChart',
  component: CryptoChart,
  args: {
    points: parseChart(rawChart),
    days: 1,
    currency: 'eur',
    coinName: 'Bitcoin',
  },
  decorators: [
    Story => (
      <div style={{ maxWidth: 700, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

export const OneDay = {};

export const NoData = { args: { points: [] } };
