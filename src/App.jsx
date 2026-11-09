import { Routes, Route, useLocation } from 'react-router';
import { useEffect, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';

import spinner from './images/spinner.svg';

import HomePage from './pages/HomePage.jsx';
import Tracker from './pages/Tracker.jsx';
import CoinPage from './pages/CoinPage.jsx';
import Navbar from './components/Navbar.jsx';
import Header from './components/Header.jsx';
import Converter from './pages/Converter.jsx';
import useStore from './hooks/useStore.js';
import ErrorFallback from './components/ErrorFallback.jsx';
import { parseMarkets } from './api/coingecko.js';

function App() {
  const currency = useStore(state => state.currency);
  const coinsState = useStore(state => state.coins);
  const { pathname } = useLocation();

  useEffect(() => {
    useStore
      .getState()
      .getData(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
        'coins'
      );
  }, [currency]);

  // Validate and normalise the API answer once, at the boundary.
  const coins = useMemo(
    () =>
      Array.isArray(coinsState.data) ? parseMarkets(coinsState.data) : null,
    [coinsState.data]
  );

  if (coinsState.loading) {
    return (
      <SpinnerContainer>
        <img src={spinner} alt="spinner" height="80" width="80"></img>
      </SpinnerContainer>
    );
  }

  return (
    <AppGrid>
      <Header title={'Crypto Cloud'} />
      <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[pathname]}>
        <Routes>
          <Route
            path="/Tracker"
            element={<Tracker coins={coins} currency={currency} />}
          />
          <Route
            path="/"
            element={
              coinsState.error || !coins ? (
                <>
                  <ErrorMessage>
                    We had issues fetching the coins for you. Please reload the
                    page to try it again!
                  </ErrorMessage>
                </>
              ) : (
                <HomePage coins={coins} currency={currency} />
              )
            }
          />
          {coins?.map(coin => (
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
