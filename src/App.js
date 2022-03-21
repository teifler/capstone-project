import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import styled from 'styled-components';

import spinner from './images/spinner.svg';

import HomePage from './pages/HomePage.js';
import Tracker from './pages/Tracker.js';
import CoinPage from './pages/CoinPage.js';
import Navbar from './components/Navbar.js';
import Header from './components/Header.js';
import ScrollToTop from './components/ScrollToTop.js';

import useStore from './hooks/useStore.js';

function App() {
  const currency = useStore(state => state.currency);
  const setCurrency = useStore(state => state.setCurrency);
  const getData = useStore(state => state.getData);
  const coins = useStore(state => state.coins);
  const setBookmark = useStore(state => state.setBookmark);

  useEffect(() => {
    getData(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
      'coins'
    );
  }, [currency]);

  if (coins.loading) {
    return <SpinnerLogo src={spinner} height="80" width="80"></SpinnerLogo>;
  }

  function toggleBookmark(id) {
    setBookmark(id);
  }

  return (
    <AppGrid>
      <Header title={'Crypto Cloud'} />
      <Main>
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
              element={
                <CoinPage
                  coin={coin}
                  currency={currency}
                  toggleBookmark={toggleBookmark}
                />
              }
            />
          ))}
        </Routes>
      </Main>
      <ScrollToTop />
      <Navigation />
    </AppGrid>
  );
}

export default App;

const AppGrid = styled.div`
  display: grid;
  grid-template-rows: 48px 1fr 48px;
  position: relative;
`;

const Main = styled.main`
  height: 100vh;
  padding: 1rem 0.5rem;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
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

const SpinnerLogo = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
