import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar.jsx';

describe('SearchBar', () => {
  it('is a labelled search field that reports every change', async () => {
    const handleChange = vi.fn();
    render(<SearchBar handleChange={handleChange} />);
    const field = screen.getByRole('searchbox', {
      name: 'Search coins by name or symbol',
    });
    await userEvent.setup().type(field, 'eth');
    expect(handleChange).toHaveBeenCalledTimes(3);
    expect(handleChange.mock.calls.at(-1)[0].target.value).toBe('eth');
  });
});
