import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
function Header({ title }) {
  return (
    <Headline>
      <h1>{title}</h1>
    </Headline>
  );
}

export default Header;

Header.propTypes = {
  name: PropTypes.string,
};

const Headline = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  width: 100%;
  height: 2.75rem;
  margin-bottom: 0.9rem;
  color: #2f66f6;
  padding-top: 10px;
`;
