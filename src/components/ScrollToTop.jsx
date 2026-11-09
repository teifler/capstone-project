import { useEffect } from 'react';
import styled from 'styled-components';
import useStore from '../hooks/useStore.js';

function ScrollToTop() {
  const isVisible = useStore(state => state.isVisible);
  const setVisible = useStore(state => state.setVisible);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [setVisible]);

  return (
    <PositionFixed>
      {isVisible && (
        <Button type="button" onClick={scrollToTop}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="28px"
            viewBox="0 0 24 24"
            width="28px"
            fill="#495057"
          >
            <g>
              <rect fill="none" height="24" width="24" />
              <path d="M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20 M12,22c5.52,0,10-4.48,10-10c0-5.52-4.48-10-10-10 C6.48,2,2,6.48,2,12C2,17.52,6.48,22,12,22L12,22z M11,12l0,4h2l0-4h3l-4-4l-4,4H11z" />
            </g>
          </svg>
        </Button>
      )}
    </PositionFixed>
  );
}

export default ScrollToTop;

const PositionFixed = styled.div`
  position: fixed;
  right: 8px;
  bottom: 75px;
  @media (min-width: 630px) {
    left: 53%;
    bottom: 80px;
  }
`;

const Button = styled.button`
  background: none;
  border: none;
  @media (min-width: 630px) {
    align-self: center;
    width: 390px;
    svg {
      height: 35px;
      width: 35px;
    }
  }
`;
