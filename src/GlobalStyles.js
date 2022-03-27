import { createGlobalStyle } from 'styled-components';
export default createGlobalStyle`

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  :root{
    --bg-color-main: #F7F8FD;
    --bg-color-gradientblue: linear-gradient(90deg, #00CBFF -0.55%, #6721FF 101.05%), #160042;
  }

  body {
    font-family: 'Roboto', sans-serif;
    background-color: --bg-color-main;
  }

  a {
    color: currentColor;
  }

  ul[role="list"] {
    list-style: none;
  }
`;
