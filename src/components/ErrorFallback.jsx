import { Link } from 'react-router';
import styled from 'styled-components';

// Shown by the error boundary instead of a blank page. It deliberately does
// not print the error message.
function ErrorFallback({ resetErrorBoundary }) {
  return (
    <Box role="alert">
      <h2>Something went wrong</h2>
      <p>This page could not be shown. The rest of the app still works.</p>
      <Actions>
        <button type="button" onClick={resetErrorBoundary}>
          Try again
        </button>
        <Link to="/">Back to all coins</Link>
      </Actions>
    </Box>
  );
}

export default ErrorFallback;

const Box = styled.section`
  max-width: 30rem;
  margin: 2rem auto;
  padding: 1.5rem;
  text-align: center;
  h2 {
    margin-bottom: 0.5rem;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`;
