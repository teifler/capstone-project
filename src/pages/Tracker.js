import CoinCard from '../components/CoinCard.js';
import ScrollToTop from '../components/ScrollToTop.js';

import styled from 'styled-components';
import useStore from '../hooks/useStore.js';

function Tracker({ coins, currency }) {
  return (
    <Container>
      <CoinList role="list">
        {coins
          .filter(coin => useStore.getState().meta.coins[coin.id]?.bookmarked)
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
      <ScrollToTop />
      {coins.filter(coin => useStore.getState().meta.coins[coin.id]?.bookmarked)
        .length === 0 ? (
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

export default Tracker;

const Container = styled.div`
  margin-bottom: 60px;
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const CoinList = styled.ul``;

const CoinNotFound = styled.p`
  color: black;
  text-align: center;
  margin-left: 30px;
  margin-right: 30px;
`;
