import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    line-height: 1.2;
  }

  :root {
    /* Text colours meet WCAG AA (4.5:1) on the page and card backgrounds. */
    --font-color-light: #5f6368;
    --font-color-lightgray: #5a5f80;
    --color-up: #2e7d32;
    --color-down: #c62828;
    --color-focus: #4b3bdb;
    --bg-color-main: #f7f8fd;
    --bg-color-gradientblue: linear-gradient(90deg, #006bb3 0%, #6721ff 100%),
      #160042;
  }

  body {
    font-family: 'Nunito', sans-serif;
    background-color: var(--bg-color-main);
    color: #160042;
  }

  a {
    color: currentColor;
  }

  :focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }

  ul[role='list'] {
    list-style: none;
  }

  button {
    font: inherit;
  }

  .visually-hidden {
    position: absolute !important;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      scroll-behavior: auto !important;
      transition: none !important;
    }
  }
`;
