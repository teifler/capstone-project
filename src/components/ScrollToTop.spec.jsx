import { describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScrollToTop from './ScrollToTop.jsx';

function scrollTo(y) {
  act(() => {
    window.scrollY = y;
    window.dispatchEvent(new Event('scroll'));
  });
}

describe('ScrollToTop', () => {
  it('appears after scrolling down, as a named button, and hides again', () => {
    render(<ScrollToTop />);
    expect(screen.queryByRole('button')).toBeNull();
    scrollTo(800);
    expect(
      screen.getByRole('button', { name: 'Back to top' })
    ).toBeInTheDocument();
    scrollTo(100);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('scrolls smoothly, or instantly for reduced motion', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    render(<ScrollToTop />);
    scrollTo(800);
    await user.click(screen.getByRole('button', { name: 'Back to top' }));
    expect(window.scrollTo).toHaveBeenLastCalledWith({
      top: 0,
      behavior: 'smooth',
    });

    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    await user.click(screen.getByRole('button', { name: 'Back to top' }));
    expect(window.scrollTo).toHaveBeenLastCalledWith({
      top: 0,
      behavior: 'auto',
    });
  });

  it('stops listening when unmounted', () => {
    const remove = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<ScrollToTop />);
    unmount();
    expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
