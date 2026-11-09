import { Outlet, useLocation } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';
import Header from './Header.jsx';
import Navbar from './Navbar.jsx';
import ErrorFallback from './ErrorFallback.jsx';

// The shell (header, navigation) always renders; only the page area shows
// loading, error or fallback states.
function Layout() {
  const { pathname } = useLocation();
  return (
    <AppGrid>
      <Header />
      <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[pathname]}>
        <Outlet />
      </ErrorBoundary>
      <Navbar />
    </AppGrid>
  );
}

export default Layout;

const AppGrid = styled.div`
  display: grid;
  position: relative;
`;
