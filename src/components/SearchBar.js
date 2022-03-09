import styled from 'styled-components';
import searchIcon from '../images/search.svg';

function SearchBar({ handleChange }) {
  return (
    <label htmlFor="search-input">
      <SearchBarContainer>
        <SearchInputContainer>
          <SearchIcon>
            <img alt="Search icon" src={searchIcon}></img>
          </SearchIcon>
          <InputField
            type="button"
            aria-label="search-input"
            id="search-input"
            name="search-input"
            onChange={handleChange}
            className="searchInput"
            type="text"
            placeholder="Type to Search"
          ></InputField>
        </SearchInputContainer>
      </SearchBarContainer>
    </label>
  );
}

export default SearchBar;

const SearchBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 19rem;
  height: 2.5rem;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0px 0.05px 5px 2px #6299ff;
  margin-bottom: 10px;
  background-color: #fff;
`;

const SearchInputContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 2px 15px;
  position: relative;
  display: flex;
  align-items: center;
`;

const InputField = styled.input`
  width: 100%;
  background-color: transparent;
  outline: none;
  border: none;
  border-radius: 6px;
  height: 100%;
  &:focus {
    outline: none;
    &::placeholder {
      opacity: 0;
    }
  }
  &::placeholder {
    transition: 250ms ease-in-out;
  }
`;

const SearchIcon = styled.span`
  font-size: 1rem;
  margin-right: 10px;
  margin-top: 3px;
  vertical-align: middle;
`;
