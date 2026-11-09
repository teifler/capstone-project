import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import SearchBar from './SearchBar.jsx';
import userEvent from '@testing-library/user-event';

describe('SearchBar', () => {
  it('renders searchbar', () => {
    render(<SearchBar />);
    const searchInputField = screen.getByRole('textbox', {
      name: 'search-input',
    });

    expect(searchInputField).toBeInTheDocument();
  });

  it('Renders searchbar with user input', async () => {
    render(<SearchBar />);
    const searchInputField = screen.getByRole('textbox', {
      name: 'search-input',
    });

    await userEvent.setup().type(searchInputField, 'Bitcoin');
    expect(searchInputField).toHaveValue('Bitcoin');
  });

  it('Renders searchbar without user input', () => {
    render(<SearchBar />);
    const searchInputField = screen.getByRole('textbox', {
      name: 'search-input',
    });

    expect(searchInputField).toHaveValue('');
  });
});
