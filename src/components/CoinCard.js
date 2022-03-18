import styled from 'styled-components';
import PropTypes from 'prop-types';
import arrowUp from '../images/arrow-up.svg';
import arrowDown from '../images/arrow-down.svg';
import { NavLink } from 'react-router-dom';

CoinCard.propTypes = {
  currency: PropTypes.string.isRequired,
  rank: PropTypes.number.isRequired,
  name: PropTypes.string,
  symbol: PropTypes.string,
  image: PropTypes.string,
  price: PropTypes.number,
  price_change_percentage_24h: PropTypes.number,
};

function CoinCard({
  currency,
  rank,
  id,
  name,
  symbol,
  image,
  price,
  price_change_percentage_24h,
}) {
  return (
    <CardWrapper to={`/${id}`}>
      <CoinRank>{rank}.</CoinRank>
      <CoinImage>
        <img alt={name} src={image} height="32" width="32"></img>
      </CoinImage>
      <CoinName>
        <h3>{name}</h3>
        <p>{symbol.toUpperCase()}</p>
      </CoinName>
      <CoinDetails>
        <p>
          {currency === 'eur'
            ? `${price
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} €`
            : `$${price
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
        </p>

        {price_change_percentage_24h >= 0 ? (
          <PriceUp>
            <img alt="Arrow up" src={arrowUp} height="12" width="12"></img>
            {price_change_percentage_24h.toFixed(2)} %
          </PriceUp>
        ) : (
          <PriceDown>
            <img alt="Arrow down" src={arrowDown} height="12" width="12"></img>
            {price_change_percentage_24h.toFixed(2)} %
          </PriceDown>
        )}
      </CoinDetails>
    </CardWrapper>
  );
}

export default CoinCard;

const CardWrapper = styled(NavLink)`
  display: flex;
  margin: 0 0 24px;
  padding: 16px;
  width: 338px;
  height: 69px;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  text-decoration: none;
  border-radius: 8px;
  justify-content: center;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const CoinRank = styled.div`
  display: flex;
  align-items: center;
  padding-right: 20px;
`;

const CoinImage = styled.div`
  display: flex;
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

const PriceDown = styled.p`
  color: red;
`;
const PriceUp = styled.p`
  color: green;
`;
