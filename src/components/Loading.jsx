import styled, { keyframes } from 'styled-components';
import spinner from '../images/spinner.svg';

// Announced to screen readers; the spinner itself only appears after 300 ms
// so fast answers do not flash it.
function Loading({ label }) {
  return (
    <Status role="status">
      <img src={spinner} alt="" height="64" width="64" />
      <span>{label}</span>
    </Status>
  );
}

export default Loading;

const appear = keyframes`
  to { opacity: 1; }
`;

const Status = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem auto;
  opacity: 0;
  animation: ${appear} 0s linear 300ms forwards;
`;
