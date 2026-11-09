import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Navbar from './Navbar.jsx';

function renderAt(path) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
    </MemoryRouter>
  );
}

describe('Navbar', () => {
  it('links to home, tracker and converter', () => {
    renderAt('/');
    const nav = screen.getByRole('navigation', { name: 'Main' });
    const links = Array.from(nav.querySelectorAll('a')).map(a => [
      a.textContent,
      a.getAttribute('href'),
    ]);
    expect(links).toEqual([
      ['Home', '/'],
      ['Tracker', '/tracker'],
      ['Convert', '/converter'],
    ]);
  });

  it('marks only the current page', () => {
    renderAt('/tracker');
    expect(screen.getByRole('link', { name: 'Tracker' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute(
      'aria-current'
    );
  });

  it('marks no link on a coin page', () => {
    renderAt('/bitcoin');
    expect(document.querySelector('[aria-current]')).toBeNull();
  });
});
