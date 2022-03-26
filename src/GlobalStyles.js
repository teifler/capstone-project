import { createGlobalStyle } from 'styled-components';
export default createGlobalStyle`

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  body {
    font-family: 'Roboto', sans-serif;
  }

  a {
    color: currentColor;
  }

  ul[role="list"] {
    list-style: none;
  }
`;
