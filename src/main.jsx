import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import GlobalStyle from './GlobalStyles.js';
import GlobalScrollToTop from './components/GlobalScrollToTop.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GlobalStyle />
      <GlobalScrollToTop />
      <App />
    </BrowserRouter>
  </StrictMode>
);
