import CoinCard from './CoinCard.jsx';
import { coinById } from '../test/fixtures.js';

export default {
  title: 'Components/CoinCard',
  component: CoinCard,
  args: { currency: 'eur', coin: coinById('bitcoin') },
  decorators: [
    Story => (
      <ul role="list" style={{ maxWidth: 338, padding: 16 }}>
        <li>
          <Story />
        </li>
      </ul>
    ),
  ],
};

export const Default = {};

// The record that blanked the live demo in 2026: 24h values are null.
export const MissingChange = { args: { coin: coinById('figure-heloc') } };

export const SubCentPrice = { args: { coin: coinById('shiba-inu') } };

export const LongName = { args: { coin: coinById('the-open-network') } };

// An id that fails validation is rendered, but never as a link.
export const InvalidId = {
  args: { coin: { ...coinById('bitcoin'), id: '/evil.example' } },
};
