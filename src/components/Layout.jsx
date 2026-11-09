import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';
import Header from './Header.jsx';
import Navbar from './Navbar.jsx';
import ErrorFallback from './ErrorFallback.jsx';
import Loading from './Loading.jsx';

// The shell (skip link, header, navigation) always renders; only the page
// area shows loading, error or fallback states. The navigation comes before
// <main> in the DOM so keyboard users reach it without tabbing through 100
// cards; visually it stays fixed at the bottom.
function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const previousPath = useRef(pathname);

  // On client-side navigation start at the top and move focus to the new
  // page, so screen reader and keyboard users are not left on <body>.
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <AppGrid>
      <SkipLink href="#main">Skip to content</SkipLink>
      <Header />
      <Navbar />
      <Main id="main" ref={mainRef} tabIndex={-1}>
        <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[pathname]}>
          <Suspense fallback={<Loading label="Loading page…" />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </Main>
    </AppGrid>
  );
}

export default Layout;

const AppGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  position: relative;
`;

const Main = styled.main`
  min-width: 0;
  padding: 0 16px 96px;
  &:focus {
    outline: none;
  }
`;

const SkipLink = styled.a`
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 20;
  padding: 8px 12px;
  background: #ffffff;
  border-radius: 4px;
  transform: translateY(-200%);
  &:focus {
    transform: none;
  }
`;
