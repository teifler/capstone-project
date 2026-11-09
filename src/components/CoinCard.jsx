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
        {coin.image && <img alt="" src={coin.image} height="32" width="32" />}
      </CoinImage>
      <CoinName>
        <h3>{coin.name}</h3>
        <p>{coin.symbol}</p>
      </CoinName>
      <CoinDetails>
        <p>{formatPrice(coin.price, currency)}</p>
        <Change $trend={direction}>
          {direction === 'up' && (
            <img alt="" src={arrowUp} height="12" width="12" />
          )}
          {direction === 'down' && (
            <img alt="" src={arrowDown} height="12" width="12" />
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
  align-items: center;
  margin: 0 0 24px;
  padding: 12px 16px;
  width: 100%;
  min-height: 69px;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  justify-content: center;
  text-decoration: none;
`;

const CardLink = styled(NavLink)`
  ${cardStyles}
  color: inherit;
  &:hover h3 {
    text-decoration: underline;
  }
`;

const CardBox = styled.div`
  ${cardStyles}
`;

const CoinRank = styled.div`
  flex: none;
  min-width: 2.25rem;
  padding-right: 8px;
`;

const CoinImage = styled.div`
  display: flex;
  flex: none;
  width: 44px;
  padding-right: 12px;
`;

const CoinName = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  h3 {
    font-size: 1rem;
    overflow-wrap: anywhere;
  }
  p {
    color: #6b6e76;
    font-size: 0.9rem;
  }
`;

const CoinDetails = styled.div`
  display: flex;
  flex: none;
  padding-left: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`;

const Change = styled.p`
  display: flex;
  align-items: center;
  gap: 2px;
  color: ${({ $trend }) =>
    $trend === 'down'
      ? 'var(--color-down)'
      : $trend === 'up'
        ? 'var(--color-up)'
        : 'inherit'};
`;
