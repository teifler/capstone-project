import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import Select from 'react-select';

import styled from 'styled-components';
import useStore from '../hooks/useStore.js';

import CryptoChart from '../components/CryptoChart.js';

import star from '../images/star.svg';
import starFilled from '../images/star-filled.svg';
import arrowLeft from '../images/arrow-left.svg';
import spinner from '../images/spinner.svg';

function CoinPage({ coin, currency }) {
  const singleCoin = useStore(state => state.singleCoin);
  const days = useStore(state => state.days);
  const setDays = useStore(state => state.setDays);
  const meta = useStore(state => state.meta);
  const chartHistory = useStore(state => state.chartHistory);

  const coinId = coin.id;

  const options = [
    { value: 7, label: '7 Days' },
    { value: 14, label: '1 Week' },
    { value: 30, label: '1 Month' },
    { value: 90, label: '3 Months' },
    { value: 365, label: '12 Months' },
  ];

  useEffect(() => {
    useStore
      .getState()
      .getData(
        `https://api.coingecko.com/api/v3/coins/${coinId}`,
        'singleCoin'
      );
  }, [coinId, currency]);

  useEffect(() => {
    useStore
      .getState()
      .getData(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`,
        'chartHistory'
      );
  }, [coinId, currency, days]);

  useEffect(() => {});
  function toggleBookmark(coinid) {
    const wasBookmarked = useStore.getState().meta.coins[coinid]?.bookmarked;
    useStore
      .getState()
      .setMeta('coins', coinId, { bookmarked: !wasBookmarked });
  }

  if (singleCoin.loading) {
    return (
      <SpinnerContainer>
        <img src={spinner} alt="spinner" height="80" width="80"></img>
      </SpinnerContainer>
    );
  }

  function currencyParser(coinProp) {
    if (currency === 'eur' && coinProp) {
      return `${coinProp
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}€`;
    } else {
      return `$${coinProp
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }
  }

  return (
    singleCoin.data && (
      <div>
        {chartHistory.error ? (
          <ErrorMessage>
            We had issues fetching the coins for you. Please reload the page to
            try it again!
          </ErrorMessage>
        ) : (
          <CardWrapper>
            <IconTextContainer>
              <GoBack to="/">
                <img
                  alt="arrow-left"
                  src={arrowLeft}
                  hight="26"
                  width="26"
                ></img>{' '}
              </GoBack>
              <p>
                {coin.name} <span>({coin.symbol.toUpperCase()})</span>
              </p>
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
            </IconTextContainer>
            <Sidebar>
              <PriceContainer>
                <p>
                  <span>{coin.name} Price</span>
                </p>
                <h3>{currencyParser(coin?.current_price)}</h3>
                <div>
                  Last 24hrs:
                  {coin.price_change_24h >= 0 ? (
                    <PriceUp>
                      {' +'}
                      {currency === 'eur'
                        ? `${currencyParser(
                            coin.price_change_24h
                          )}  (+${coin.price_change_percentage_24h.toFixed(
                            2
                          )}%)`
                        : `${currencyParser(
                            coin.price_change_24h
                          )} (+${coin.price_change_percentage_24h.toFixed(
                            2
                          )}%)`}
                    </PriceUp>
                  ) : (
                    <PriceDown>
                      {' '}
                      {currency === 'eur'
                        ? `${currencyParser(
                            coin?.price_change_24h
                          )} (${coin.price_change_percentage_24h.toFixed(2)}%)`
                        : `${currencyParser(
                            coin?.price_change_24h
                          )} (${coin.price_change_percentage_24h.toFixed(2)}%)`}
                    </PriceDown>
                  )}
                </div>
              </PriceContainer>
              <CicleContainer>
                <CircleBg>
                  <CoinImageCircle>
                    <img alt={coin.id} src={coin.image} height="32"></img>
                  </CoinImageCircle>
                </CircleBg>
              </CicleContainer>
            </Sidebar>
            <LabelSelect>
              <Select
                aria-label="Select timeframe of chart"
                options={options}
                isSearchable={false}
                placeholder="Select Timeframe"
                onChange={e => setDays(e.value)}
              />
            </LabelSelect>
            {chartHistory.data && (
              <CryptoChart
                chartHistory={chartHistory.data}
                currency={currency}
                days={days}
              />
            )}
            <MarketInformationContainer>
              <InfoBox>
                <p>Market Cap</p>
                <h3>
                  $
                  {coin.market_cap
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </h3>
              </InfoBox>
              <InfoBox>
                <p>Market Cap (24h)</p>
                <h3>
                  {singleCoin.data.market_data.market_cap_change_percentage_24h.toFixed(
                    2
                  )}
                  %
                </h3>
              </InfoBox>
              <InfoBox>
                <p>Popularity</p>
                <h3>#{coin.market_cap_rank}</h3>
              </InfoBox>
              <InfoBox>
                <p>Low (24h)</p>
                <h3>
                  {currencyParser(
                    singleCoin.data.market_data.low_24h[currency]
                  )}
                </h3>
              </InfoBox>
              <InfoBox>
                <p>All-Time Low</p>
                <h3>
                  {currencyParser(singleCoin.data.market_data.atl[currency])}
                </h3>
              </InfoBox>
              <InfoBox>
                <p>All time high</p>
                <h3>
                  {currencyParser(singleCoin.data.market_data.ath[currency])}
                </h3>
              </InfoBox>
            </MarketInformationContainer>
          </CardWrapper>
        )}
      </div>
    )
  );
}

export default CoinPage;

const CardWrapper = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  margin-bottom: 65px;
  max-width: 700px;
  position: relative;
`;

const IconTextContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  p {
    font-weight: bold;
  }
  span {
    color: var(--font-color-lightgray);
    font-size: 0.75;
  }
  margin-bottom: 30px;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;

  span {
    color: var(--font-color-lightgray);
    font-size: 1rem;
  }

  h3 {
    margin-bottom: 4px;
  }
`;

const GoBack = styled(NavLink)``;

const TrackButton = styled.button`
  border-style: none;
  background-color: transparent;
`;

const CicleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(182, 185, 206, 0.09) center;
  border-radius: 36px;
  height: 72px;
  width: 72px;
  background-position: center;
`;

const CircleBg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(182, 185, 206, 0.16) center;
  background-position: center;
  border-radius: 25px;
  height: 50px;
  width: 50px;
  padding-top: 2px;
`;

const CoinImageCircle = styled.div`
  margin-right: 0;
`;

const Sidebar = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 20px;
`;

const LabelSelect = styled.label`
  width: 100%;
`;

const MarketInformationContainer = styled.div`
  display: flex;
  justify-content: space-between;

  flex-wrap: wrap;
  margin-top: 32px;
  max-width: 550px;
  margin-left: 15px;
  @media (min-width: 700px) {
    div:nth-child(2n) {
      align-items: flex-end;
    }
  }
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 50%;
  margin-bottom: 24px;
  p {
    color: var(--font-color-lightgray);
  }
`;

const PriceDown = styled.p`
  color: red;
  display: inline;
`;
const PriceUp = styled.p`
  color: green;
  display: inline;
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

const ErrorMessage = styled.h3`
  color: red;
`;
