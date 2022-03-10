import { render, screen } from '@testing-library/react';
import SearchBar from './SearchBar.js';
import userEvent from '@testing-library/user-event';

describe('SearchBar', () => {
  it('Check if SearchBar gets rendered', () => {
    render(<SearchBar />);
    const SearchInputField = screen.getByRole('textbox', {
      name: 'search-input',
    });

    expect(SearchInputField).toBeInTheDocument();
  });

  it('Check if you can write input into searchbar', () => {
    render(<SearchBar />);
    userEvent.type(screen.getByRole('textbox'), 'Bitcoin');
    expect(screen.getByRole('textbox')).toHaveValue('Bitcoin');
  });
});
