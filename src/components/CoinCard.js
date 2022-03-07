import styled from 'styled-components';

function CoinCard({
  currency,
  rank,
  name,
  symbol,
  image,
  price,
  price_change_percentage_24h,
}) {
  return (
    <CardWrapper>
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
          {currency === 'eur' ? `${price.toFixed(2)}€` : `$${price.toFixed(2)}`}
        </p>

        {price_change_percentage_24h >= 0 ? (
          <ColorGreen>{price_change_percentage_24h.toFixed(2)} %</ColorGreen>
        ) : (
          <ColorRed>{price_change_percentage_24h.toFixed(2)} %</ColorRed>
        )}
      </CoinDetails>
    </CardWrapper>
  );
}

export default CoinCard;

const CardWrapper = styled.div`
  display: flex;
  margin: 0px 0 24px 11px;
  padding: 16px;
  width: 338px;
  height: 69px;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  justify-content: center;
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
  width: 102.5px;
  h3 {
    font-size: 16px;
  }
  p {
    color: #a9abb1;
    font-size: 15px;
  }
`;

const CoinDetails = styled.div`
  display: flex;
  width: 147.5px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
`;

const ColorRed = styled.p`
  color: red;
`;
const ColorGreen = styled.p`
  color: green;
`;
