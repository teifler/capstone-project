import React from 'react';
import Home from './pages/Home.js';
import styled from 'styled-components';

//import { ErrorBoundary } from 'react-error-boundary';
//import ErrorFallback from './components/ErrorFallback.js';

import { useState } from 'react';

function App() {
  return (
    <>
      {
        //<ErrorBoundary FallbackComponent={ErrorFallback}>
      }
      <Home />
    </>
  );
}

export default App;
