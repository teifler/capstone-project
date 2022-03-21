import CoinCard from '../components/CoinCard.js';
import styled from 'styled-components';

function HomePage({ coins, currency }) {
  return (
    <Container>
      <CoinList role="list">
        {coins
          .filter(coin => coin.isBookmarked)
          .map(coin => {
            return (
              <CoinCard
                currency={currency}
                rank={coin.market_cap_rank}
                id={coin.id}
                key={coin.id}
                name={coin.name}
                symbol={coin.symbol}
                image={coin.image}
                price={coin.current_price}
                price_change_percentage_24h={coin.price_change_percentage_24h}
              />
            );
          })}
      </CoinList>
      {coins.filter(coin => coin.isBookmarked).length === 0 ? (
        <CoinNotFound>
          There is nothing in your tracking list. You can add cryptocurrencys to
          your tracking list by clicking the star icon.
        </CoinNotFound>
      ) : (
        ''
      )}
    </Container>
  );
}

export default HomePage;

const Container = styled.div`
  margin-bottom: 60px;
  display: flex;
  justify-content: center;
`;

const CoinList = styled.ul``;

const CoinNotFound = styled.p`
  color: black;
  text-align: center;
`;
