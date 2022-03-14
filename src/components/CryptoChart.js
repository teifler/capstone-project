import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';

import styled from 'styled-components';

function CryptoChart({ cryptoHistory, days, currency }) {
  const coinPriceList = cryptoHistory.prices.map(coin => coin[1]);
  const coinTimestampes = cryptoHistory.prices.map(coin => {
    const date = new Date(coin[0]);
    return date.toLocaleDateString();
  });

  const options1 = {
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <Wrapper>
      Chart
      <Line
        data={{
          labels: coinTimestampes,
          datasets: [
            {
              label: `Price ( Past ${days} Days) in ${currency}`,
              data: coinPriceList,
              fill: true,
              backgroundColor: '#88A6E7',
              borderColor: '#2F66F6',
            },
          ],
        }}
        options={{
          elements: {
            point: {
              radius: 1,
            },
          },
        }}
      />
    </Wrapper>
  );
}

export default CryptoChart;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
