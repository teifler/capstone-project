import { useEffect } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';
import App from '../App.jsx';

function LocationProbe({ onChange }) {
  const location = useLocation();
  useEffect(() => onChange(location), [location, onChange]);
  return null;
}

// Renders the whole app at `path`; `location()` returns the router location.
export function renderApp(path = '/') {
  let current;
  const view = render(
    <MemoryRouter initialEntries={[path]}>
      <App />
      <LocationProbe
        onChange={location => {
          current = location;
        }}
      />
    </MemoryRouter>
  );
  return { ...view, location: () => current };
}
