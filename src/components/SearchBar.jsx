import styled from 'styled-components';

function SearchBar({ handleChange }) {
  return (
    <SearchBarContainer>
      <label htmlFor="coin-search" className="visually-hidden">
        Search coins by name or symbol
      </label>
      <InputField
        id="coin-search"
        name="search"
        type="search"
        autoComplete="off"
        onChange={handleChange}
        placeholder="Search a cryptocurrency…"
      />
      <SearchIcon aria-hidden="true">
        <svg
          width="16"
          height="16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.476 4.559a4.184 4.184 0 1 1-5.917 5.917 4.184 4.184 0 0 1 5.917-5.917"
            stroke="#160042"
          />
          <path d="m12.667 12.667-2.194-2.194" stroke="#160042" />
        </svg>
      </SearchIcon>
    </SearchBarContainer>
  );
}

export default SearchBar;

// The focus ring sits on the pill-shaped container (the input itself has no
// border), so keyboard users always see where they are.
const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  width: min(19rem, 100%);
  height: 2.5rem;
  margin: 20px auto;
  padding: 2px 5px 2px 15px;
  border-radius: 25px;
  background-color: #fff;
  box-shadow: 0px 0.05px 5px 2px #6299ff;

  &:focus-within {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }
`;

const InputField = styled.input`
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  background-color: transparent;
  font: inherit;

  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #5f6368;
  }
`;

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 32px;
  height: 32px;
  background: #f0f2f8;
  border-radius: 100%;
`;
