import { createGlobalStyle } from 'styled-components';
export default createGlobalStyle`

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    line-height: 1.2;
  }

  :root{
    --font-color-light:#7B7D83;
    --font-color-lightgray: #6B7194;
    --bg-color-main: #f7f8fd;
    --bg-color-gradientblue: linear-gradient(90deg, #00CBFF -0.55%, #6721FF 101.05%), #160042;
  }

  body {
    font-family: 'Nunito', sans-serif;
    background-color: var(--bg-color-main);
  }

  a {
    color: currentColor;
  }

  ul[role="list"] {
    list-style: none;
  }
`;
