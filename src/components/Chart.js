import React from 'react';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';

function Chart(cryptoHistory, days) {
  return (
    <Wrapper>
      Chart
      <Line>
        data=
        {{
          labels: cryptoHistory.map(coin => {
            let date = new Date(coin[0]);
            let time =
              date.getHours() > 12
                ? `${date.getHours() - 12} : ${date.getMinutes()} PM`
                : `${date.getHours()} : ${date.getMinutes()} AM`;
            return days === 1 ? time : date.toLocalDateString();
          }),
        }}
      </Line>
    </Wrapper>
  );
}

export default Chart;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
