import { render, screen } from '@testing-library/react';
import SearchBar from './SearchBar.js';

describe('SearchBar', () => {
  it('Check if SearchBar gets rendered', () => {
    render(<SearchBar />);
    const SearchInputField = screen.getByRole('textbox', {
      name: 'search-input',
    });

    expect(SearchInputField).toBeInTheDocument();
  });
});
