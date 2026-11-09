import { Link } from 'react-router';
import styled from 'styled-components';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

function NotFound({ title = 'Page not found', children }) {
  useDocumentTitle(title);
  return (
    <Box>
      <h2>{title}</h2>
      <p>{children ?? 'There is nothing at this address.'}</p>
      <Link to="/">Back to all coins</Link>
    </Box>
  );
}

export default NotFound;

const Box = styled.section`
  max-width: 30rem;
  margin: 2rem auto;
  padding: 0 1rem;
  text-align: center;
  p {
    margin: 0.75rem 0 1rem;
  }
`;
