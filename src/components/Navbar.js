import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <NavContainer>
      <LinkTo to="/">
        <Wrapper>
          <Image>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="30px"
              viewBox="0 0 24 24"
              width="30px"
              fill=""
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
            </svg>
          </Image>
          <Text>Home</Text>
        </Wrapper>
      </LinkTo>
      <LinkTo to="/Tracker">
        <Wrapper>
          <Image>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="30px"
              viewBox="0 0 24 24"
              width="30px"
              fill="black"
            >
              <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
            </svg>
          </Image>
          <Text>Tracker</Text>
        </Wrapper>
      </LinkTo>
    </NavContainer>
  );
};

export default Navbar;

const NavContainer = styled.nav`
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-radius: 5px;
  z-index: 10;
  background-color: #d7d9e4;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const LinkTo = styled(NavLink)`
  opacity: 0.5;
  width: 50%;
  text-decoration: none;

  &.active {
    color: #2f66f6;
    opacity: 1;
    svg {
      fill: #2f66f6;
    }
  }
`;
const Image = styled.div``;
const Text = styled.p``;
