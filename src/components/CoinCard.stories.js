import CoinCard from './CoinCard.js';
export default {
  title: 'Component/CoinCard',
  component: CoinCard,
};
const Template = args => <CoinCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  currency: 'EUR',
  rank: 1,
  name: 'Bitcoin',
  symbol: 'BTC',
  image:
    'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
  price: 35245,
  price_change_percentage_24h: -1.44141,
};
