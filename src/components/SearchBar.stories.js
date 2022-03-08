import SearchBar from './SearchBar.js';
export default {
  title: 'Component/SearchBar',
  component: SearchBar,
};
const Template = args => <SearchBar {...args} />;

export const Default = Template.bind({});
Default.args = {};
