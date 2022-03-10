import Header from './Header.js';
export default {
  title: 'Component/Header',
  component: Header,
};
const Template = args => <Header {...args} />;

export const Default = Template.bind({});
Default.args = {};
