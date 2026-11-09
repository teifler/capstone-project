import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApiErrorNotice from './ApiErrorNotice.jsx';
import { ApiError } from '../api/errors.js';

describe('ApiErrorNotice', () => {
  it.each([
    ['rate-limit', /limiting the number of requests/],
    ['unreachable', /could not be reached/],
    ['offline', /appear to be offline/],
    ['timeout', /took too long/],
    ['http', /could not use/],
    ['parse', /could not use/],
  ])('explains a %s error without technical details', (kind, reason) => {
    render(
      <ApiErrorNotice
        what="the coin list"
        error={new ApiError(kind, 'HTTP 503 internal detail')}
        onRetry={() => {}}
      />
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('We couldn’t load the coin list.');
    expect(alert).toHaveTextContent(reason);
    expect(alert).not.toHaveTextContent('internal detail');
  });

  it('shows the countdown instead of the button while retrying automatically', () => {
    render(
      <ApiErrorNotice
        what="x"
        error={new ApiError('rate-limit', '429')}
        retryInSeconds={12}
        onRetry={() => {}}
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('in about 12 seconds');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('calls onRetry from the button', async () => {
    const onRetry = vi.fn();
    render(<ApiErrorNotice what="x" error={null} onRetry={onRetry} />);
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
