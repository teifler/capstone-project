import Header from '../components/Header.js';
import { useState } from 'react';
import styled from 'styled-components';
import star from '../images/star.svg';
import arrowLeft from '../images/arrow-left.svg';
import arrowUp from '../images/arrow-up.svg';
import arrowDown from '../images/arrow-down.svg';
import { NavLink } from 'react-router-dom';

function CoinPage({ coin, title, currency }) {
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
            <li>{coin.symbol.toUpperCase()}: 1BTC</li>
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
      </CardWrapper>
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

const PriceDown = styled.p`
  color: red;
  display: inline;
`;
const PriceUp = styled.p`
  color: green;
  display: inline;
`;
