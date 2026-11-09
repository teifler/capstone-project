import { Route, Routes } from 'react-router';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import Tracker from './pages/Tracker.jsx';
import CoinPage from './pages/CoinPage.jsx';
import Converter from './pages/Converter.jsx';
import NotFound from './pages/NotFound.jsx';

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
        <Route path="converter" element={<Converter currency="eur" />} />
        <Route path=":coinId" element={<CoinPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
