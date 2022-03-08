import styled from 'styled-components';

function SearchBar({ handleChange }) {
  return (
    <InputField
      id="search-input"
      name="search-input"
      onChange={handleChange}
      className="searchInput"
      type="text"
      pattern="[A-Za-z0-9_]{1,15}"
      placeholder="Type to Search"
    ></InputField>
  );
}

export default SearchBar;

const InputField = styled.input`
  width: 289px;
  height: 40px;
  margin-bottom: 20px;
  /* Align Textbox Center */
  ::-webkit-input-placeholder {
    text-align: center;
  }
  :-moz-placeholder {
    /* Firefox 18- */
    text-align: center;
  }
  ::-moz-placeholder {
    /* Firefox 19+ */
    text-align: center;
  }
  :-ms-input-placeholder {
    text-align: center;
  }
`;
