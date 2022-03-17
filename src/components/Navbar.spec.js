import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import Navbar from './Navbar.js';

describe('Navbar', () => {
  it('Renders Navbar with two links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const navLinks = screen.getAllByRole('link');
    expect(navLinks).toHaveLength(2);
  });
});
