import styled from 'styled-components';

export function errorReason(error) {
  switch (error?.kind) {
    case 'rate-limit':
      return 'CoinGecko’s free API is limiting the number of requests right now.';
    case 'unreachable':
      return 'CoinGecko could not be reached. Its free API may be limiting requests.';
    case 'offline':
      return 'You appear to be offline.';
    case 'timeout':
      return 'CoinGecko took too long to answer.';
    default:
      return 'CoinGecko sent an answer we could not use.';
  }
}

// Friendly, specific error with either an automatic retry countdown or a
// "Try again" button. Raw error details are never shown.
function ApiErrorNotice({ what, error, retryInSeconds, onRetry }) {
  return (
    <Notice role="alert">
      <p>
        <strong>We couldn’t load {what}.</strong> {errorReason(error)}
      </p>
      {retryInSeconds ? (
        <p>Trying again automatically in about {retryInSeconds} seconds.</p>
      ) : (
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </Notice>
  );
}

export default ApiErrorNotice;

const Notice = styled.div`
  max-width: 30rem;
  margin: 1.5rem auto;
  padding: 1rem 1.25rem;
  border-radius: 10px;
  background: #fff4f4;
  border: 1px solid #f1c3c3;
  text-align: center;
  p + p,
  p + button {
    margin-top: 0.5rem;
  }
`;
