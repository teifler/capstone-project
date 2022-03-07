/* eslint-disable jsx-a11y/no-redundant-roles */
import Header from './components/Header.js';
import { useState } from 'react';
import CoinCard from './components/CoinCard.js';
import styled from 'styled-components';

function Home({ coins, currency }) {
  const [search, setSearch] = useState('');

  const filterdCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = e => {
    setSearch(e.target.value);
  };
  console.log(coins);
  return (
    <>
      <Header />
      <div className="coins-container">
        <CoinSearch>
          <form>
            <label>
              <InputField
                id="search-input"
                name="search-input"
                onChange={handleChange}
                className="searchInput"
                type="text"
                placeholder="Type to Search"
              ></InputField>
            </label>
          </form>
        </CoinSearch>
        <TableHeading>
          <p>#</p>
          <p>Name</p>
          <StackedHeading>
            <p>Price</p>
            <p>% Change 24H</p>
          </StackedHeading>
        </TableHeading>
        <CoinList role="list">
          {filterdCoins.map(coin => {
            return (
              <CoinCard
                currency={currency}
                data-testid={'test'}
                rank={coin.market_cap_rank}
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
      </div>
    </>
  );
}

export default Home;

const InputField = styled.input`
  width: 289px;
  height: 40px;
  margin-bottom: 20px;
  /* Align Textbox Center */
  ::-webkit-input-placeholder {
    text-align: center;
  }
  :-moz-placeholder {
    /* Firefox 18- */
    text-align: center;
  }
  ::-moz-placeholder {
    /* Firefox 19+ */
    text-align: center;
  }
  :-ms-input-placeholder {
    text-align: center;
  }
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
