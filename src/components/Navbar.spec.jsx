import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import Navbar from './Navbar.jsx';

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
