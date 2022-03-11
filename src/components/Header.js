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
  height: 5rem;
  border-bottom: 1px solid black;
  margin-bottom: 1.5rem;
  color: #2f66f6;
`;
