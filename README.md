# CryptoCloud - Built with React, zustand and more.

> This is my capstone project for the web development bootcamp at [neueFische](https://www.neuefische.de/weiterbildung/web-development) 🦈

<img align="right" src="https://user-images.githubusercontent.com/10044263/161130557-2e4aed54-dd6b-4621-8fed-b8f3f3514055.gif" alt="crypto cloud preview" width="350px" height="500px" />

## `About`

CryptoCloud makes it easy to track and convert your favorite cryptocurrencies. Add your favorites coins to your trackinglist, so you'll get an easy overview of all price movements in one place. You can also convert the current top 100 crypto currencys instantly.

Please note that Cryptocloud is still under construction. Please let me know if you find a bug, I would be happy to fix it :)

### `Preview`

Check the live version: [https://capstone-project-teifler.vercel.app](https://capstone-project-teifler.vercel.app)

## `Features`

- Search coin
- Detail page for each coin
- Tracking List
- Converter

## `Tech Stack`

- [React 19](https://react.dev/) with [React Router](https://reactrouter.com/)
- [Zustand](https://github.com/pmndrs/zustand) (favourites, persisted in localStorage)
- [styled-components](https://styled-components.com/)
- [Chart.js](https://www.chartjs.org/) with [react-chartjs-2](https://react-chartjs-2.js.org/)
- [React Select](https://react-select.com/home)
- [Vite](https://vite.dev/) for development and builds
- [Vitest](https://vitest.dev/), [Testing Library](https://testing-library.com/) and [axe-core](https://github.com/dequelabs/axe-core) for tests
- [Storybook](https://storybook.js.org/) with the Vite builder
- ESLint (flat config, react-hooks and jsx-a11y rules) and Prettier
- [npm](https://www.npmjs.com/), deployed on [Vercel](https://vercel.com/)

## `Project setup locally`

You need Node.js 22.22 or newer (see `.nvmrc`).

- Clone this repository

Go to the project directory

```bash
  cd capstone-project
```

Install dependencies

```bash
  npm ci
```

Start the development server

```bash
  npm run dev
```

- Server: [http://localhost:5173/](http://localhost:5173/)

### Scripts

| Command                   | What it does                                                   |
| ------------------------- | -------------------------------------------------------------- |
| `npm run dev`             | Development server with hot reload                             |
| `npm run build`           | Production build into `dist/`                                  |
| `npm run preview`         | Serves `dist/` with the same security headers as the live site |
| `npm test`                | Runs all tests once (`npm run test:watch` keeps watching)      |
| `npm run coverage`        | Tests with a coverage report in `coverage/`                    |
| `npm run lint`            | ESLint; fails on any warning                                   |
| `npm run format`          | Formats the code with Prettier (`format:check` only checks)    |
| `npm run storybook`       | Storybook on [http://localhost:6006/](http://localhost:6006/)  |
| `npm run build-storybook` | Static Storybook build into `storybook-static/`                |

## API

You don't need an API key. The app uses the free public [CoinGecko API](https://www.coingecko.com/en/api):

- `/coins/markets` for the top 100, a single coin and your tracked coins
- `/coins/{id}/market_chart` for the price chart

The free API allows only a few requests per minute. The app caches answers for 60 seconds, shares requests between pages, and waits and retries automatically when CoinGecko answers with HTTP 429.

## Running Tests

To run tests, run the following command

```bash
  npm test
```

The tests never call the real API: requests are answered from recorded CoinGecko responses in `src/test/fixtures/`.

## Running Storybook

To run storybook, run the following command

```bash
  npm run storybook
```

## 2026 update

In November 2026 the live demo was blank: CoinGecko had started returning `null` for the 24-hour change of one top-100 coin, and the app crashed while formatting it. Fixing that turned into a general update of the project. The full list is in the commit history; in short:

**Tooling**

- Create React App (deprecated) replaced by Vite, Jest by Vitest, the CRA ESLint preset by an ESLint flat config.
- React 17 → 19, React Router 6 → 8, zustand 3 → 5, styled-components 5 → 6, Chart.js 3 → 4, Storybook 6 → 10. Storybook's configuration is now committed, so it runs from a fresh clone.
- Removed unused packages, including two that were installed by mistake (`usestate`, `react-use-effect`), and declared the ones that were imported but missing from `package.json`. `npm audit` went from 182 vulnerable packages to 0.

**Fixes**

- API data is validated once when it arrives; missing numbers show as "–" instead of crashing the page, and an error boundary keeps the rest of the app usable if a page fails.
- One route for all coins: deep links work for any coin, unknown coins show "Coin not found", other unknown addresses show a 404 page.
- Data is cached per coin, outdated responses are discarded, and a failed request shows an error instead of the previous coin's numbers. The artificial two-second delay on every response is gone.
- The converter calculates with the prices the app already has instead of downloading a 7.6 MB coin list and calling an API on every keystroke. The made-up exchange fee is removed.
- Prices below one cent are readable, all amounts use one currency format.
- Accessibility: list markup, labels, visible keyboard focus, colour contrast, skip link, focus handling on navigation, and a layout that works at 320 px width. axe reports no violations on any page.
- Initial JavaScript is about half the size: the chart and the select component load only on the pages that use them.

**Security measures**

- Coin ids from the API or the URL must match `^[a-z0-9-]{1,100}$` before they are used in links, routes or API URLs. This closes an open redirect through API-controlled ids (React Router CVE-2025-68470 / CVE-2026-53669) and a prototype-pollution path in the old store.
- Favourites are stored as a validated list of ids with a versioned format; anything else found in `localStorage` is ignored. Favourites saved by the 2022 version are migrated.
- `vercel.json` sets a Content Security Policy (`default-src 'none'`, scripts only from the site itself, network access only to the CoinGecko API, images only from CoinGecko's image hosts, Trusted Types) and `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` and `X-Frame-Options`. Styles still need `'unsafe-inline'` because of styled-components.
- The Nunito font is served from the site itself, so no visitor data goes to Google Fonts.
- No source maps in production, no install scripts during `npm ci`.
- GitHub Actions runs lint, tests with a coverage floor, both builds, `npm audit` and `npm audit signatures` on every pull request, with read-only permissions and actions pinned to commit SHAs. Dependabot proposes weekly, grouped updates.
