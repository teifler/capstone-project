import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import Navbar from './Navbar.js';

describe('Navbar', () => {
  it('Renders Navbar with three links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const allLinks = screen.getAllByRole('link');
    expect(allLinks).toHaveLength(3);
  });
});
