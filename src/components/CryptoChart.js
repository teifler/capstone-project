import React from 'react';
import { Line } from 'react-chartjs-2';
// eslint-disable-next-line no-unused-vars
import { Chart } from 'chart.js/auto';
import styled from 'styled-components';

function CryptoChart({ chartHistory, days, currency }) {
  const coinPriceList = chartHistory.prices.map(coin => coin[1]);
  const coinTimestampes = chartHistory.prices.map(coin => {
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
  height: 270px;
  width: 100%;
  margin-top: 10px;
  background-color: white;

  box-shadow: 0px 3px 8px rgba(78, 84, 126, 0.02),
    0px 6px 16px rgba(78, 84, 126, 0.04), 0px 11px 24px rgba(78, 84, 126, 0.02);
  border-radius: 10px;
  padding-bottom: 20px;
  @media (min-width: 600px) {
    flex-grow: 1;
    height: 320px;
    width: 100%;
  }
`;
