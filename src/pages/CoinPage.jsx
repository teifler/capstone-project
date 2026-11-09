import {
  Navigate,
  NavLink,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router';
import Select from 'react-select';
import styled from 'styled-components';

import CryptoChart from '../components/CryptoChart.jsx';
import ApiErrorNotice from '../components/ApiErrorNotice.jsx';
import Loading from '../components/Loading.jsx';
import NotFound from './NotFound.jsx';
import {
  parseDays,
  TIMEFRAMES,
  useChart,
  useCoin,
  VS_CURRENCY,
} from '../api/coingecko.js';
import { useFavorites } from '../store/favorites.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { isValidCoinId } from '../lib/validate.js';
import {
  formatCompactCurrency,
  formatPercent,
  formatPrice,
  formatPriceChange,
  trend,
} from '../lib/format.js';

import star from '../images/star.svg';
import starFilled from '../images/star-filled.svg';
import arrowLeft from '../images/arrow-left.svg';

const options = TIMEFRAMES.map(({ days, label }) => ({ value: days, label }));
const currency = VS_CURRENCY;

function CoinPage() {
  const { coinId = '' } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const days = parseDays(searchParams.get('days'));
  const valid = isValidCoinId(coinId);

  const { coin, error, isLoading, retry, retryInSeconds } = useCoin(coinId);
  const chart = useChart(coin ? coinId : null, days);
  const isFavorite = useFavorites(state => state.favorites.includes(coinId));
  const toggleFavorite = useFavorites(state => state.toggleFavorite);
  useDocumentTitle(coin ? `${coin.name} (${coin.symbol})` : undefined);

  if (!valid) {
    // /Bitcoin -> /bitcoin; anything else that is not a coin id is a 404.
    const lower = coinId.toLowerCase();
    return isValidCoinId(lower) ? (
      <Navigate
        to={{ pathname: `/${lower}`, search: location.search }}
        replace
      />
    ) : (
      <NotFound />
    );
  }
  if (isLoading) return <Loading label="Loading coin…" />;
  if (error) {
    return (
      <ApiErrorNotice
        what="this coin"
        error={error}
        retryInSeconds={retryInSeconds}
        onRetry={retry}
      />
    );
  }
  if (!coin) {
    return (
      <NotFound title="Coin not found">
        CoinGecko has no coin with the id “{coinId}”.
      </NotFound>
    );
  }

  const changeTrend = trend(coin.change24h);

  return (
    <Page>
      <TitleRow>
        <BackLink to="/">
          <img alt="Back to all coins" src={arrowLeft} height="26" width="26" />
        </BackLink>
        <h2>
          {coin.name} <span>({coin.symbol})</span>
        </h2>
        <TrackButton
          type="button"
          aria-pressed={isFavorite}
          aria-label={`Track ${coin.name}`}
          onClick={() => toggleFavorite(coinId)}
        >
          <img
            src={isFavorite ? starFilled : star}
            alt=""
            height="30"
            width="30"
          />
        </TrackButton>
      </TitleRow>

      <PriceRow>
        <PriceContainer>
          <p>{coin.name} Price</p>
          <Price>{formatPrice(coin.price, currency)}</Price>
          <p>
            Last 24 hours:{' '}
            <Change $trend={changeTrend}>
              {formatPriceChange(coin.change24h, currency)} (
              {formatPercent(coin.changePercent24h)})
            </Change>
          </p>
        </PriceContainer>
        <CoinLogo>
          {coin.image && <img alt="" src={coin.image} height="32" width="32" />}
        </CoinLogo>
      </PriceRow>

      <TimeframeSelect>
        <label htmlFor="chart-timeframe" className="visually-hidden">
          Chart timeframe
        </label>
        <Select
          inputId="chart-timeframe"
          options={options}
          isSearchable={false}
          value={options.find(option => option.value === days)}
          onChange={option =>
            setSearchParams({ days: String(option.value) }, { replace: true })
          }
        />
      </TimeframeSelect>
      <ChartArea>
        {chart.isLoading && <Loading label="Loading chart…" />}
        {chart.error && (
          <ApiErrorNotice
            what="the price chart"
            error={chart.error}
            retryInSeconds={chart.retryInSeconds}
            onRetry={chart.retry}
          />
        )}
        {chart.data && (
          <CryptoChart
            points={chart.data}
            currency={currency}
            days={days}
            coinName={coin.name}
          />
        )}
      </ChartArea>

      <MarketData>
        <div>
          <dt>Market cap</dt>
          <dd>{formatCompactCurrency(coin.marketCap, currency)}</dd>
        </div>
        <div>
          <dt>Market cap (24h)</dt>
          <dd>{formatPercent(coin.marketCapChangePercent24h)}</dd>
        </div>
        <div>
          <dt>Market cap rank</dt>
          <dd>{coin.rank === null ? '–' : `#${coin.rank}`}</dd>
        </div>
        <div>
          <dt>Low (24h)</dt>
          <dd>{formatPrice(coin.low24h, currency)}</dd>
        </div>
        <div>
          <dt>All-time low</dt>
          <dd>{formatPrice(coin.atl, currency)}</dd>
        </div>
        <div>
          <dt>All-time high</dt>
          <dd>{formatPrice(coin.ath, currency)}</dd>
        </div>
      </MarketData>
    </Page>
  );
}

export default CoinPage;

const Page = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 1rem 0 2rem;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  margin-bottom: 30px;
  h2 {
    font-size: 1.1rem;
    text-align: center;
    overflow-wrap: anywhere;
  }
  span {
    color: var(--font-color-lightgray);
    font-size: 0.9rem;
  }
`;

const BackLink = styled(NavLink)`
  flex: none;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
`;

const TrackButton = styled.button`
  flex: none;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 20px;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  p:first-child {
    color: var(--font-color-lightgray);
  }
`;

const Price = styled.p`
  font-size: 1.4rem;
  font-weight: 700;
  overflow-wrap: anywhere;
`;

const Change = styled.span`
  color: ${({ $trend }) =>
    $trend === 'down'
      ? 'var(--color-down)'
      : $trend === 'up'
        ? 'var(--color-up)'
        : 'inherit'};
`;

const CoinLogo = styled.div`
  flex: none;
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(182, 185, 206, 0.16);
  box-shadow: 0 0 0 11px rgba(182, 185, 206, 0.09) inset;
`;

const TimeframeSelect = styled.div`
  width: 100%;
`;

const ChartArea = styled.div`
  width: 100%;
`;

const MarketData = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px 16px;
  width: 100%;
  max-width: 550px;
  margin-top: 32px;
  dt {
    color: var(--font-color-lightgray);
  }
  dd {
    margin-top: 4px;
    font-size: 1.17rem;
    font-weight: 700;
    overflow-wrap: anywhere;
  }
  @media (min-width: 700px) {
    div:nth-child(2n) {
      text-align: right;
    }
  }
`;
