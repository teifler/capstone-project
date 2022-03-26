import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import styled from 'styled-components';
import useStore from '../hooks/useStore.js';

import CryptoChart from '../components/CryptoChart.js';

import star from '../images/star.svg';
import starFilled from '../images/star-filled.svg';
import arrowLeft from '../images/arrow-left.svg';
import arrowUp from '../images/arrow-up.svg';
import arrowDown from '../images/arrow-down.svg';
import spinner from '../images/spinner.svg';

function CoinPage({ coin, title, currency }) {
  const days = useStore(state => state.days);
  const setDays = useStore(state => state.setDays);
  const meta = useStore(state => state.meta);
  const chartHistory = useStore(state => state.chartHistory);

  const coinId = coin.id;
  useEffect(() => {
    useStore
      .getState()
      .getData(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`,
        'chartHistory'
      );
  }, [coinId, currency, days]);
  useEffect(() => {});
  function toggleBookmark(id) {
    const wasBookmarked = useStore.getState().meta.coins[id]?.bookmarked;
    useStore.getState().setMeta('coins', id, { bookmarked: !wasBookmarked });
  }

  if (coin.loading) {
    return <SpinnerLogo src={spinner} height="80" width="80"></SpinnerLogo>;
  }

  return (
    <div>
      {chartHistory.error ? (
        <ErrorMessage>
          We had issues fetching the coins for you. Please reload the page to
          try it again!
        </ErrorMessage>
      ) : (
        <CardWrapper>
          <GoBack to="/">
            <img alt="arrow-left" src={arrowLeft} hight="35" width="35"></img>{' '}
          </GoBack>
          <TrackButton onClick={() => toggleBookmark(coin.id)}>
            {meta.coins[coin.id]?.bookmarked ? (
              <img
                src={starFilled}
                alt="Remove coin of your tracking list"
                height="30"
                width="30"
              ></img>
            ) : (
              <img
                src={star}
                alt="Add coin to your tracking list"
                height="30"
                width="30"
              ></img>
            )}
          </TrackButton>
          <CoinImages>
            <img alt={coin.id} src={coin.image} height="80"></img>
          </CoinImages>
          <CoinName>
            <h2>{coin.name}</h2>
          </CoinName>
          <InformationWrapper>
            <h4>Market Information</h4>
            <StyledList role="list">
              <li>Rank: {coin.market_cap_rank}</li>
              <li>
                {currency.toUpperCase()}:{' '}
                {currency === 'eur'
                  ? `${coin.current_price
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} €`
                  : `$${coin.current_price
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
              </li>
            </StyledList>
          </InformationWrapper>
          <InformationWrapper>
            <h4>Last day Information</h4>
            <StyledList role="list">
              <li>
                High:{' '}
                {currency === 'eur'
                  ? `${coin.high_24h
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} €`
                  : `$${coin.high_24h
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
              </li>
              <li>
                Low:{' '}
                {currency === 'eur'
                  ? `${coin.low_24h
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} €`
                  : `$${coin.low_24h
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
              </li>
              <li>
                Last 24H:
                {coin.market_cap_change_percentage_24h >= 0 ? (
                  <PriceUp>
                    <img
                      alt="Arrow up"
                      src={arrowUp}
                      height="12"
                      width="12"
                    ></img>
                    {coin.price_change_percentage_24h.toFixed(2)} %
                  </PriceUp>
                ) : (
                  <PriceDown>
                    <img
                      alt="Arrow down"
                      src={arrowDown}
                      height="12"
                      width="12"
                    ></img>
                    {coin.price_change_percentage_24h.toFixed(2)} %
                  </PriceDown>
                )}
              </li>
            </StyledList>
          </InformationWrapper>
          <SelectTimeFrame
            id="dropdown"
            placeholder="Set Timeframe"
            defaultValue="1"
            onChange={e => setDays(e.target.value)}
          >
            <option value="1">24h</option>
            <option value="7">7D</option>
            <option value="30">1M</option>
            <option value="90">3M</option>
            <option value="365">1Y</option>
          </SelectTimeFrame>
          {chartHistory.data && (
            <CryptoChart
              chartHistory={chartHistory.data}
              currency={currency}
              days={days}
            />
          )}
        </CardWrapper>
      )}
    </div>
  );
}

export default CoinPage;

const CardWrapper = styled.div`
  display: flex;
  margin-left: auto;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  min-width: 340px;
  padding: 2rem;
  position: relative;
  margin-bottom: 65px;
`;

const StyledList = styled.ul``;

const GoBack = styled(NavLink)`
  align-self: flex-start;
`;

const CoinName = styled.div`
  width: 90%;
  text-align: center;
  display: flex;
  flex-direction: column;
  margin: 20px 0 20px 0;

  align-items: space-around;
  h3 {
    font-size: 1rem;
  }
  p {
    color: #a9abb1;
    font-size: 0.9rem;
  }
`;

const InformationWrapper = styled.div`
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  width: 90%;
  padding: 10px;
  line-height: 130%;
  font-size: 110%;
  max-width: 400px;

  li {
    text-align: left;
    font-size: 1rem;
  }
`;

const TrackButton = styled.button`
  position: absolute;
  top: 32px;
  right: 15px;
  border-style: none;
  background-color: transparent;
`;

const CoinImages = styled.div`
  display: flex;
  justify-content: center;
  width: 90%;
  margin-bottom: 15px;
  margin-right: 0;
`;

const SelectTimeFrame = styled.select`
  width: 30%;
  align-self: flex-start;
  @media (min-width: 768px) {
    align-self: center;
    width: 390px;
  }
  margin-bottom: 5px;
`;

const PriceDown = styled.p`
  color: red;
  display: inline;
`;
const PriceUp = styled.p`
  color: green;
  display: inline;
`;

const SpinnerLogo = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ErrorMessage = styled.h3`
  color: red;
`;
