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
    <div>
      <CardWrapper>
        <IconTextContainer>
          <GoBack to="/">
            <img alt="arrow-left" src={arrowLeft} height="26" width="26" />
          </GoBack>
          <p>
            {coin.name} <span>({coin.symbol})</span>
          </p>
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
        </IconTextContainer>
        <Sidebar>
          <PriceContainer>
            <p>
              <span>{coin.name} Price</span>
            </p>
            <h3>{formatPrice(coin.price, currency)}</h3>
            <div>
              Last 24hrs:{' '}
              <Change $trend={changeTrend}>
                {formatPriceChange(coin.change24h, currency)} (
                {formatPercent(coin.changePercent24h)})
              </Change>
            </div>
          </PriceContainer>
          <CicleContainer>
            <CircleBg>
              <CoinImageCircle>
                {coin.image && (
                  <img alt={coin.id} src={coin.image} height="32" />
                )}
              </CoinImageCircle>
            </CircleBg>
          </CicleContainer>
        </Sidebar>
        <LabelSelect>
          <Select
            aria-label="Select timeframe of chart"
            options={options}
            isSearchable={false}
            value={options.find(option => option.value === days)}
            onChange={option =>
              setSearchParams({ days: String(option.value) }, { replace: true })
            }
          />
        </LabelSelect>
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
        <MarketInformationContainer>
          <InfoBox>
            <p>Market Cap</p>
            <h3>{formatCompactCurrency(coin.marketCap, currency)}</h3>
          </InfoBox>
          <InfoBox>
            <p>Market Cap (24h)</p>
            <h3>{formatPercent(coin.marketCapChangePercent24h)}</h3>
          </InfoBox>
          <InfoBox>
            <p>Popularity</p>
            <h3>{coin.rank === null ? '–' : `#${coin.rank}`}</h3>
          </InfoBox>
          <InfoBox>
            <p>Low (24h)</p>
            <h3>{formatPrice(coin.low24h, currency)}</h3>
          </InfoBox>
          <InfoBox>
            <p>All-Time Low</p>
            <h3>{formatPrice(coin.atl, currency)}</h3>
          </InfoBox>
          <InfoBox>
            <p>All time high</p>
            <h3>{formatPrice(coin.ath, currency)}</h3>
          </InfoBox>
        </MarketInformationContainer>
      </CardWrapper>
    </div>
  );
}

export default CoinPage;

const CardWrapper = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  margin-bottom: 65px;
  max-width: 700px;
  position: relative;
`;

const IconTextContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  p {
    font-weight: bold;
  }
  span {
    color: var(--font-color-lightgray);
    font-size: 0.75rem;
  }
  margin-bottom: 30px;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;

  span {
    color: var(--font-color-lightgray);
    font-size: 1rem;
  }

  h3 {
    margin-bottom: 4px;
  }
`;

const GoBack = styled(NavLink)``;

const TrackButton = styled.button`
  border-style: none;
  background-color: transparent;
`;

const CicleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(182, 185, 206, 0.09) center;
  border-radius: 36px;
  height: 72px;
  width: 72px;
  background-position: center;
`;

const CircleBg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(182, 185, 206, 0.16) center;
  background-position: center;
  border-radius: 25px;
  height: 50px;
  width: 50px;
  padding-top: 2px;
`;

const CoinImageCircle = styled.div`
  margin-right: 0;
`;

const Sidebar = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 20px;
`;

const LabelSelect = styled.div`
  width: 100%;
`;

const MarketInformationContainer = styled.div`
  display: flex;
  justify-content: space-between;

  flex-wrap: wrap;
  margin-top: 32px;
  max-width: 550px;
  margin-left: 15px;
  @media (min-width: 700px) {
    div:nth-child(2n) {
      align-items: flex-end;
    }
  }
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 50%;
  margin-bottom: 24px;
  p {
    color: var(--font-color-lightgray);
  }
`;

const Change = styled.span`
  color: ${({ $trend }) =>
    $trend === 'down' ? 'red' : $trend === 'up' ? 'green' : 'inherit'};
`;
