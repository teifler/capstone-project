import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import Header from '../components/Header.js';
import CryptoChart from '../components/CryptoChart.js';

import star from '../images/star.svg';
import arrowLeft from '../images/arrow-left.svg';
import arrowUp from '../images/arrow-up.svg';
import arrowDown from '../images/arrow-down.svg';
import spinner from '../images/spinner.svg';

function CoinPage({ coin, title, currency }) {
  const [isLoading, setIsLoading] = useState(true);
  const [days, setDays] = useState(3);
  const [cryptoHistory, setCryptoHistory] = useState([]);
  const [error, setError] = useState('');

  console.log('Days -- ', days);

  useEffect(() => {
    const fetchData = async () => {
      const url = `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=${currency}&days=${days}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setCryptoHistory(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [days, currency]);
  {
    //ADD ERROR RENDERING -- ADD FETCH FOR COIN
  }

  if (isLoading) {
    return <SpinnerLogo src={spinner} height="80" width="80"></SpinnerLogo>;
  }

  {
    //MAYBE ADD DAYS to change chart
  }
  console.log(cryptoHistory);
  const handleClick = (e, num) => {
    console.log('HIER IST NUM IN FUNCTION', num);
  };
  return (
    <div>
      <Header title="Coin Details" />
      <CardWrapper>
        <GoBack to="/">
          <img alt="arrow-left" src={arrowLeft} hight="35" width="35"></img>{' '}
        </GoBack>
        <IconFav alt="icon-fav" src={star} width="28" height="28"></IconFav>
        <CoinImages>
          <img alt={coin.id} src={coin.image} height="80"></img>
        </CoinImages>
        <CoinName>
          <h2>{coin.name}</h2>
        </CoinName>
        <InformationWrapper>
          <h4>Market Information</h4>
          <ul role="list">
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
          </ul>
        </InformationWrapper>
        <InformationWrapper>
          <h4>Last day Information</h4>
          <ul role="list">
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
          </ul>
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
        <CryptoChart
          cryptoHistory={cryptoHistory}
          currency={currency}
          days={days}
        />
      </CardWrapper>

      <button onClick={handleClick(10)}></button>
      <button onClick={handleClick}></button>
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
  margin: 0 auto auto;
  position: relative;
`;

const GoBack = styled(NavLink)`
  display: flex;
  align-self: flex-start;
  text-decoration: none;
  align-items: flex-end;
  padding-bottom: 5px;
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

  li {
    text-align: left;
    font-size: 1rem;
  }
`;

const IconFav = styled.img`
  position: absolute;
  top: 32px;
  right: 15px;
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
  margin-top: 40vh;
`;
