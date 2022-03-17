import Header from '../components/Header.js';
import { useState } from 'react';
import CoinCard from '../components/CoinCard.js';
import styled from 'styled-components';

function HomePage({ coins, currency }) {
  return (
    <Container>
      <Header title="Crypto Cloud" />
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
`;

const CoinList = styled.ul``;

const CoinSearch = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TableHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  margin: 0 auto;
  padding: 5px 0 5px;
  width: 90%;
  margin-bottom: 24px;
`;

const StackedHeading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`;

const SearchErrorMessage = styled.p`
  color: red;
  text-align: center;
  padding-bottom: 5px;
`;

const CoinNotFound = styled.p`
  color: black;
  text-align: center;
`;
