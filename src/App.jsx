import { lazy } from 'react';
import { Route, Routes } from 'react-router';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import Tracker from './pages/Tracker.jsx';
import NotFound from './pages/NotFound.jsx';

// Chart.js and react-select load only with the pages that use them.
const CoinPage = lazy(() => import('./pages/CoinPage.jsx'));
const Converter = lazy(() => import('./pages/Converter.jsx'));

// One parameter route for every coin instead of one generated route per API
// record: deep links work for any coin, unknown ids get a "not found" page,
// and API data never becomes a route pattern. Route matching is
// case-insensitive, so the old /Tracker links keep working.
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="tracker" element={<Tracker />} />
        <Route path="converter" element={<Converter />} />
        <Route path=":coinId" element={<CoinPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
