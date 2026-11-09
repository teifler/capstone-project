import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header.jsx';

describe('Header', () => {
  it('is the banner with the site name as the only h1', () => {
    render(<Header />);
    const banner = screen.getByRole('banner');
    expect(banner).toContainElement(
      screen.getByRole('heading', { level: 1, name: 'CRYPTO CLOUD' })
    );
    // The logo is decorative: the heading already names the site.
    expect(screen.queryByRole('img')).toBeNull();
  });
});
