import { fn } from 'storybook/test';
import SearchBar from './SearchBar.jsx';

export default {
  title: 'Components/SearchBar',
  component: SearchBar,
  args: { handleChange: fn() },
};

export const Default = {};
