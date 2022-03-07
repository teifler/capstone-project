import React from 'react';
import styled from 'styled-components';
function Header() {
  return <Headline>CoinFox</Headline>;
}

export default Header;

const Headline = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #2f66f6;
  height: 80px;
  border-bottom: 1px solid black;
  margin-bottom: 24px;
`;
