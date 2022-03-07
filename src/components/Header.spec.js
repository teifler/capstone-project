import { render, screen } from '@testing-library/react';
import Header from './Header.js';

describe('Header', () => {
  it('renders h1 with pagetitel', () => {
    render(<Header />);
    const checkBanner = screen.getByRole('banner');
    expect(checkBanner).toBeInTheDocument();
  });
});
