import { createGlobalStyle } from 'styled-components';
export default createGlobalStyle`

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  body {

  }

  a {
    color: currentColor;
  }

  ul[role="list"] {
    list-style: none;
  }
`;
