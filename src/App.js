import { Routes, Route, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useEffect } from 'react';
import styled from 'styled-components';

import spinner from './images/spinner.svg';

import HomePage from './pages/HomePage.js';
import Tracker from './pages/Tracker.js';
import CoinPage from './pages/CoinPage.js';
import Navbar from './components/Navbar.js';
import Header from './components/Header.js';
import Converter from './pages/Converter.js';
import useStore from './hooks/useStore.js';

function App() {
  const currency = useStore(state => state.currency);
  const coins = useStore(state => state.coins);
  const location = useLocation();

  useEffect(() => {
    useStore
      .getState()
      .getData(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
        'coins'
      );
  }, [currency]);

  if (coins.loading) {
    return (
      <SpinnerContainer>
        <img src={spinner} alt="spinner" height="80" width="80"></img>
      </SpinnerContainer>
    );
  }

  return (
    <AppGrid>
      <Header title={'Crypto Cloud'} />
      <ErrorBoundary
        FallbackComponent={PageError}
        resetKeys={[location.pathname]}
      >
        <Routes>
          <Route
            path="/Tracker"
            element={<Tracker coins={coins.data} currency={currency} />}
          />
          <Route
            path="/"
            element={
              coins.error ? (
                <>
                  <ErrorMessage>
                    We had issues fetching the coins for you. Please reload the
                    page to try it again!
                  </ErrorMessage>
                </>
              ) : (
                <HomePage coins={coins.data} currency={currency} />
              )
            }
          />
          {coins.data?.map(coin => (
            <Route
              key={coin.id}
              path={`${coin.id}`}
              element={<CoinPage coin={coin} currency={currency} />}
            />
          ))}
          <Route
            path="/converter"
            element={<Converter currency={currency} />}
          />
        </Routes>
      </ErrorBoundary>
      <Navigation />
    </AppGrid>
  );
}

export default App;

// Shown instead of a blank page when a page crashes; navigating away resets it.
function PageError() {
  return (
    <ErrorMessage role="alert">
      Something went wrong while showing this page. Please reload the page or
      try again later.
    </ErrorMessage>
  );
}

const AppGrid = styled.div`
  display: grid;
  position: relative;
  overflow-y: hidden;
`;

const Navigation = styled(Navbar)`
  position: sticky;
  bottom: 0;
  z-index: 1;
`;

const ErrorMessage = styled.h3`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: red;
  text-align: center;
`;

const SpinnerContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform: -webkit-translate(-50%, -50%);
  transform: -moz-translate(-50%, -50%);
  transform: -ms-translate(-50%, -50%);
`;
