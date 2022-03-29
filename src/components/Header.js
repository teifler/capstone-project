import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import logo from '../images/logo.svg';

function Header({ title }) {
  return (
    <Headline>
      <img src={logo} width="84" height="67" alt="logo"></img>
      <h1>
        CRYPTO <span>CLOUD</span>
      </h1>
    </Headline>
  );
}

export default Header;

Header.propTypes = {
  name: PropTypes.string,
};

const Headline = styled.header`
  display: flex;
  margin-top: 5px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 2.75rem;
  padding: 2.5rem 0.875rem 0 0;
  margin: 5px 0 1.4rem 0;

  span {
    background: var(--bg-color-gradientblue);
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
  }
`;
