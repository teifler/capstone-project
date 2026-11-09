import { useEffect, useState } from 'react';
import styled from 'styled-components';

const SHOW_AFTER_PX = 400;

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function ScrollToTop() {
  const [visible, setVisible] = useState(() => window.scrollY > SHOW_AFTER_PX);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  if (!visible) return null;
  return (
    <Button
      type="button"
      aria-label="Back to top"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        })
      }
    >
      <svg
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        height="28"
        viewBox="0 0 24 24"
        width="28"
        fill="currentColor"
      >
        <path d="M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20 M12,22c5.52,0,10-4.48,10-10c0-5.52-4.48-10-10-10 C6.48,2,2,6.48,2,12C2,17.52,6.48,22,12,22L12,22z M11,12l0,4h2l0-4h3l-4-4l-4,4H11z" />
      </svg>
    </Button>
  );
}

export default ScrollToTop;

// Only as large as its icon (it used to be an invisible 390 px wide button
// lying over the coin cards on wide screens).
const Button = styled.button`
  position: fixed;
  right: 16px;
  bottom: 88px;
  z-index: 5;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: #ffffff;
  color: #343a40;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  cursor: pointer;
`;
