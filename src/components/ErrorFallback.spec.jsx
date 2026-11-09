import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './ErrorFallback.jsx';

describe('ErrorFallback', () => {
  it('replaces a crashed page with a message and can reset it', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    let shouldThrow = true;
    function Page() {
      if (shouldThrow) throw new Error('secret internals');
      return <p>Recovered</p>;
    }
    render(
      <MemoryRouter>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Page />
        </ErrorBoundary>
      </MemoryRouter>
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Something went wrong');
    expect(alert).not.toHaveTextContent('secret internals');
    expect(
      screen.getByRole('link', { name: 'Back to all coins' })
    ).toHaveAttribute('href', '/');

    shouldThrow = false;
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.getByText('Recovered')).toBeInTheDocument();
    vi.restoreAllMocks();
  });
});
