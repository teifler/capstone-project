import styled from 'styled-components';
import { NavLink } from 'react-router';
import arrowUp from '../images/arrow-up.svg';
import arrowDown from '../images/arrow-down.svg';
import { formatPercent, formatPrice, trend } from '../lib/format.js';
import { coinPath } from '../lib/validate.js';

function CoinCard({ coin, currency }) {
  const path = coinPath(coin.id);
  const direction = trend(coin.changePercent24h);
  const content = (
    <>
      <CoinRank>{coin.rank ?? '–'}.</CoinRank>
      <CoinImage>
        {coin.image && (
          <img alt={coin.name} src={coin.image} height="32" width="32" />
        )}
      </CoinImage>
      <CoinName>
        <h3>{coin.name}</h3>
        <p>{coin.symbol}</p>
      </CoinName>
      <CoinDetails>
        <p>{formatPrice(coin.price, currency)}</p>
        <Change $trend={direction}>
          {direction === 'up' && (
            <img alt="Arrow up" src={arrowUp} height="12" width="12" />
          )}
          {direction === 'down' && (
            <img alt="Arrow down" src={arrowDown} height="12" width="12" />
          )}
          {formatPercent(coin.changePercent24h)}
        </Change>
      </CoinDetails>
    </>
  );
  // A card only becomes a link for an id that passed validation.
  return path ? (
    <CardLink to={path}>{content}</CardLink>
  ) : (
    <CardBox>{content}</CardBox>
  );
}

export default CoinCard;

const cardStyles = `
  display: flex;
  margin: 0 0 24px;
  padding: 16px;
  width: 338px;
  height: 69px;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  justify-content: center;
  text-decoration: none;
`;

const CardLink = styled(NavLink)`
  ${cardStyles}
  &:hover {
    text-decoration: underline;
  }
`;

const CardBox = styled.div`
  ${cardStyles}
`;

const CoinRank = styled.div`
  display: flex;
  align-items: center;
  padding-right: 20px;
`;

const CoinImage = styled.div`
  display: flex;
  width: 44px;
  padding-right: 12px;
`;

const CoinName = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 152px;
  h3 {
    font-size: 1rem;
  }
  p {
    color: #a9abb1;
    font-size: 0.9rem;
  }
`;

const CoinDetails = styled.div`
  display: flex;
  width: 112px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`;

const Change = styled.p`
  color: ${({ $trend }) =>
    $trend === 'down' ? 'red' : $trend === 'up' ? 'green' : 'inherit'};
`;
