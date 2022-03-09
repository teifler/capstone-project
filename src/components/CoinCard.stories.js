import Header from './CoinCard.js';
export default {
  title: 'Component/CoinCard',
  component: CoinCard,
};
const Template = args => <Header {...args} />;

export const Default = Template.bind({});
Default.args = {};
