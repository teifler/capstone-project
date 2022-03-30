import styled from 'styled-components';

function SearchBar({ handleChange }) {
  return (
    <label>
      <SearchBarContainer>
        <SearchInputContainer>
          <InputField
            aria-label="search-input"
            name="search-input"
            onChange={handleChange}
            type="text"
            placeholder="Search a cryptocurrency.."
          ></InputField>
          <SearchIcon>
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
        </SearchInputContainer>
      </SearchBarContainer>
    </label>
  );
}

export default SearchBar;

const SearchBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 19rem;
  height: 2.5rem;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0px 0.05px 5px 2px #6299ff;
  margin-bottom: 20px;
  background-color: #fff;
  margin-top: 20px;
  border-radius: 25px;
`;

const SearchInputContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 2px 5px 2px 15px;
  display: flex;
  align-items: center;
`;

const InputField = styled.input`
  width: 100%;
  background-color: transparent;
  outline: none;
  border: none;
  border-radius: 25px;
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

const SearchIcon = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  vertical-align: middle;
  width: 32px;
  height: 32px;
  left: 323px;
  top: 114px;
  background: #f0f2f8;
  border-radius: 100%;
`;
