import { MemoryRouter } from 'react-router';
import GlobalStyle from '../src/GlobalStyles.js';

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  decorators: [
    Story => (
      <MemoryRouter>
        <GlobalStyle />
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    // Fail a story's accessibility check on any axe violation.
    a11y: { test: 'error' },
  },
};

export default preview;
