import React from 'react';

function CoinCard({ name, symbol, image, price, price_change_percentage_24h }) {
  return (
    <>
      <li>
        <img alt={name} src={image} height="40" width="40" /> {name}
      </li>
      <li>{symbol}</li>
      <li>Price: {price}</li>
      <li>{price_change_percentage_24h}</li>
    </>
  );
}

export default CoinCard;
