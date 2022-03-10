import { render, screen } from '@testing-library/react';
import Header from './Header.js';

describe('Header', () => {
  it('Renders headline of the page', () => {
    render(<Header />);
    const checkBanner = screen.getByRole('banner');
    expect(checkBanner).toBeInTheDocument();
  });
});
