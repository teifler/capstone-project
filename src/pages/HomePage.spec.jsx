import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import HomePage from './HomePage.jsx';
import { coins } from '../test/fixtures.js';

describe('HomePage', () => {
  it('renders the live top list including the coin with null 24h values', () => {
    render(
      <MemoryRouter>
        <HomePage coins={coins} currency="eur" />
      </MemoryRouter>
    );
    expect(screen.getAllByRole('link')).toHaveLength(coins.length);
    expect(screen.getByText('Figure Heloc')).toBeInTheDocument();
  });
});
