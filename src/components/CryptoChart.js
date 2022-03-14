import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';

import styled from 'styled-components';

function CryptoChart({ cryptoHistory, days, currency }) {
  const coinPriceList = cryptoHistory.prices.map(coin => coin[1]);
  const coinTimestampes = cryptoHistory.prices.map(coin => {
    const date = new Date(coin[0]);
    return days < 2
      ? date.toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })
      : date.toLocaleDateString();
  });

  return (
    <Wrapper>
      Chart
      <Line
        data={{
          labels: coinTimestampes,
          responsive: true,
          datasets: [
            {
              label: `Price last ${days} days in ${currency}`,
              data: coinPriceList,
              fill: true,
              backgroundColor: '#88A6E7',
              borderColor: '#2F66F6',
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
          lineHeightAnnotation: {
            alwayse: true,
            hover: false,
            lineWeight: 10.5,
          },
          animation: {
            duration: 2000,
          },
          maintainAspectRatio: false,
          responsive: true,
          legend: {
            display: false,
          },
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
  height: 250px;
`;
