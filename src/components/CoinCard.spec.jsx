import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import CoinCard from './CoinCard.jsx';
import { coinById } from '../test/fixtures.js';

function renderCard(coin) {
  return render(
    <MemoryRouter>
      <CoinCard coin={coin} currency="eur" />
    </MemoryRouter>
  );
}

describe('CoinCard', () => {
  it('shows name, symbol, price and 24h change and links to the coin page', () => {
    renderCard(coinById('bitcoin'));
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/bitcoin');
    expect(link).toHaveTextContent('Bitcoin');
    expect(link).toHaveTextContent('BTC');
    expect(link).toHaveTextContent('€66,433.00');
    expect(link).toHaveTextContent('-2.12%');
  });

  it('renders a coin whose 24h change is null (crashed the live demo)', () => {
    renderCard(coinById('figure-heloc'));
    const link = screen.getByRole('link');
    expect(link).toHaveTextContent('Figure Heloc');
    expect(link).toHaveTextContent('–');
    expect(screen.queryByAltText(/arrow/i)).not.toBeInTheDocument();
  });

  it('keeps sub-cent prices visible', () => {
    renderCard(coinById('shiba-inu'));
    expect(screen.getByRole('link')).toHaveTextContent('€0.00000392');
  });

  it('never turns an unvalidated id into a link', () => {
    renderCard({ ...coinById('bitcoin'), id: '/evil.example' });
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
  });
});
