import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import Layout from './Layout.jsx';

function Boom() {
  throw new TypeError("Cannot read properties of null (reading 'toFixed')");
}

describe('Layout', () => {
  it('keeps header and navigation when a page crashes, and recovers on navigation', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <MemoryRouter initialEntries={['/broken']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="broken" element={<Boom />} />
            <Route index element={<p>Home works</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    expect(screen.getByRole('alert')).not.toHaveTextContent('toFixed');
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Main' })
    ).toBeInTheDocument();

    await userEvent.setup().click(screen.getByRole('link', { name: 'Home' }));
    expect(screen.getByText('Home works')).toBeInTheDocument();
  });
});
