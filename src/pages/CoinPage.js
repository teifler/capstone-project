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

function CoinPage({ coin, currency }) {
  const singleCoin = useStore(state => state.singleCoin);
  const days = useStore(state => state.days);
  const setDays = useStore(state => state.setDays);
  const meta = useStore(state => state.meta);
  const chartHistory = useStore(state => state.chartHistory);
  const coinId = coin.id;
  useEffect(() => {
    useStore
      .getState()
      .getData(
        `https://api.coingecko.com/api/v3/coins/${coinId}`,
        'singleCoin'
      );
  }, [coinId, currency, days]);

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

  console.log(singleCoin.data);

  if (singleCoin.loading) {
    return <SpinnerLogo src={spinner} height="80" width="80"></SpinnerLogo>;
  }
  //ADD MORE TO REDUCE CODE
  function currencyChecker(coinProp) {
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
            <InfoContainer>
              <GoBack to="/">
                <img
                  alt="arrow-left"
                  src={arrowLeft}
                  hight="26"
                  width="26"
                ></img>{' '}
              </GoBack>
              <h4>
                {coin.name} <span>({coin.symbol.toUpperCase()})</span>
              </h4>
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
            </InfoContainer>
            <SideBarImageContainer>
              <PriceContainer>
                <p>{coin.name} Price</p>
                <h4>{currencyChecker(coin?.current_price)}</h4>
                <div>
                  Last 24hrs:
                  {coin.price_change_24h >= 0 ? (
                    <PriceUp>
                      {' +'}
                      {currency === 'eur'
                        ? `${coin.price_change_24h
                            .toFixed(2)
                            .toString()
                            .replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ','
                            )}€ (+${coin.price_change_percentage_24h.toFixed(
                            2
                          )}%)`
                        : `$${coin.price_change_24h
                            .toFixed(2)
                            .toString()
                            .replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ','
                            )} (+${coin.price_change_percentage_24h.toFixed(
                            2
                          )}%)`}
                    </PriceUp>
                  ) : (
                    <PriceDown>
                      {' '}
                      {currency === 'eur'
                        ? `${coin.price_change_24h
                            .toFixed(2)
                            .toString()
                            .replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ','
                            )}€ (-${coin.price_change_percentage_24h.toFixed(
                            2
                          )}%)`
                        : `${coin.price_change_24h
                            .toFixed(2)
                            .toString()
                            .replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ','
                            )}$ (${coin.price_change_percentage_24h.toFixed(
                            2
                          )}%)`}
                    </PriceDown>
                  )}
                </div>
              </PriceContainer>
              <CicleContainer>
                <CircleImage>
                  <CoinImages>
                    <img alt={coin.id} src={coin.image} height="32"></img>
                  </CoinImages>
                </CircleImage>
              </CicleContainer>
            </SideBarImageContainer>

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
                <p>Market Cap Change (24h)</p>
                <h3>
                  {singleCoin.data.market_data.market_cap_change_percentage_24h.toFixed(
                    2
                  )}
                  %
                </h3>
              </InfoBox>
              <InfoBox>
                <p>Popularity</p>
                <h3>#${coin.market_cap_rank}</h3>
              </InfoBox>
              <InfoBox>
                <p>Low (24h)</p>
                <h3>
                  {currencyChecker(
                    singleCoin.data.market_data.low_24h[currency]
                  )}
                </h3>
              </InfoBox>
              <InfoBox>
                <p>All-Time Low</p>
                <h3>
                  {currencyChecker(singleCoin.data.market_data.atl[currency])}
                </h3>
              </InfoBox>
              <InfoBox>
                <p>All time high</p>
                <h3>
                  {currencyChecker(singleCoin.data.market_data.ath[currency])}
                </h3>
              </InfoBox>
            </MarketInformationContainer>
            <About>
              <h3>About {coin.name}</h3>
              <p>{singleCoin.data.description.en}</p>
            </About>
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
  width: 90%;
`;

const InfoContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  span {
    color: var(--font-color-light);
    font-size: 0.75;
  }
  margin-bottom: 30px;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

const StyledList = styled.ul``;

const GoBack = styled(NavLink)``;

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
  top: 32px;
  right: 15px;
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

const CircleImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(182, 185, 206, 0.16) center;
  background-position: center;
  border-radius: 25px;
  height: 50px;
  width: 50px;
`;

const CoinImages = styled.div`
  margin-right: 0;
  padding-top: 2px;
`;

const SideBarImageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
`;

const MarketInformationContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 32px;

  max-width: 550px;
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 22px;
  margin-bottom: 24px;
  p {
    color: #b6b9ce;
  }
`;

const About = styled.section`
  h3 {
    text-align: center;
  }
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
