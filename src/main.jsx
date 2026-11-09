// Self-hosted font: no request to Google Fonts, so visitors' IP addresses are
// not sent to a third party and the CSP can stay at font-src 'self'.
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/500.css';
import '@fontsource/nunito/700.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import GlobalStyle from './GlobalStyles.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GlobalStyle />
      <App />
    </BrowserRouter>
  </StrictMode>
);
