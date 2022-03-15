import { getByRole, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';
import 'jest-canvas-mock';

import CryptoChart from './CryptoChart.js';

const sampleDay = 1;

const sampleHistory = {
  prices: [
    [1647186855967, 35709.01945701433],
    [1647187177103, 35720.94853862576],
    [1647187459439, 35711.937420460716],
    [1647187728814, 35713.634755216655],
    [1647188011826, 35754.526159746674],
    [1647188402519, 35706.560769406424],
    [1647188630689, 35678.06874897554],
    [1647188995067, 35710.67144797573],
  ],
};

describe('CryptoChart', () => {
  it('renders the sample data from above', () => {
    render(
      <CryptoChart
        cryptoHistory={sampleHistory}
        days={sampleDay}
        currency={'eur'}
      />
    );
  });
});
