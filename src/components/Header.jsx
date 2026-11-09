import styled from 'styled-components';
import logo from '../images/logo.svg';

function Header() {
  return (
    <Headline>
      <img src={logo} width="84" height="67" alt="" />
      <h1>
        CRYPTO <span>CLOUD</span>
      </h1>
    </Headline>
  );
}

export default Header;

const Headline = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  min-height: 2.75rem;
  padding: 2.5rem 16px 0;
  margin: 5px 0 1.4rem 0;

  img {
    width: clamp(56px, 18vw, 84px);
    height: auto;
  }

  h1 {
    font-size: clamp(1.5rem, 7vw, 2rem);
    white-space: nowrap;
  }

  span {
    background: var(--bg-color-gradientblue);
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
  }
`;
