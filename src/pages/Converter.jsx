import { useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import ApiErrorNotice from '../components/ApiErrorNotice.jsx';
import Loading from '../components/Loading.jsx';
import { useTopCoins } from '../api/coingecko.js';
import { convertAmount, parseAmount } from '../lib/convert.js';
import { formatAmount } from '../lib/format.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

const formatTime = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
});

function CoinOption({ coin }) {
  return (
    <OptionLabel>
      {coin.image && <img src={coin.image} alt="" height="24" width="24" />}
      <span>
        {coin.symbol} <small>{coin.name}</small>
      </span>
    </OptionLabel>
  );
}

// Converts between two of today's top-100 coins with the EUR prices of the
// list the app already loaded: no request per keystroke, no 7.6 MB coin
// directory, and a failed list shows an error instead of an old result.
function Converter() {
  const top = useTopCoins();
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [amountText, setAmountText] = useState('1');
  useDocumentTitle('Converter');

  if (top.isLoading) return <Loading label="Loading prices…" />;
  if (top.error) {
    return (
      <ApiErrorNotice
        what="the prices"
        error={top.error}
        retryInSeconds={top.retryInSeconds}
        onRetry={top.retry}
      />
    );
  }

  const coins = top.data ?? [];
  const options = coins.map(coin => ({ value: coin.id, coin }));
  const from = coins.find(coin => coin.id === fromId);
  const to = coins.find(coin => coin.id === toId);
  const amount = parseAmount(amountText);
  const result =
    from && to ? convertAmount(amount.value, from.price, to.price) : null;
  const updatedAt = coins
    .map(coin => Date.parse(coin.lastUpdated ?? ''))
    .filter(Number.isFinite)
    .sort((a, b) => b - a)[0];

  let resultText = 'Choose two coins and an amount.';
  if (from && to && amount.value !== null) {
    resultText =
      result === null
        ? `No current price for ${from.price === null ? from.name : to.name}.`
        : `${formatAmount(amount.value)} ${from.symbol} = ${formatAmount(result)} ${to.symbol}`;
  }

  return (
    <Wrapper>
      <h2>Crypto Currency Converter</h2>
      <ConverterForm onSubmit={event => event.preventDefault()}>
        <Field>
          <label htmlFor="convert-from">Convert from</label>
          <Select
            inputId="convert-from"
            options={options}
            value={options.find(option => option.value === fromId) ?? null}
            onChange={option => setFromId(option?.value ?? '')}
            getOptionLabel={option =>
              `${option.coin.symbol} ${option.coin.name}`
            }
            formatOptionLabel={option => <CoinOption coin={option.coin} />}
            placeholder="Select a coin"
          />
        </Field>

        <Field>
          <label htmlFor="convert-amount">Amount</label>
          <AmountInput>
            <input
              id="convert-amount"
              inputMode="decimal"
              autoComplete="off"
              value={amountText}
              onChange={event => setAmountText(event.target.value)}
              aria-invalid={amount.error ? true : undefined}
              aria-describedby={
                amount.error ? 'convert-amount-error' : undefined
              }
            />
            {from && <span aria-hidden="true">{from.symbol}</span>}
          </AmountInput>
          {amount.error && (
            <FieldError id="convert-amount-error">{amount.error}</FieldError>
          )}
        </Field>

        <SwapButton
          type="button"
          onClick={() => {
            setFromId(toId);
            setToId(fromId);
          }}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z" />
          </svg>
          Swap coins
        </SwapButton>

        <Field>
          <label htmlFor="convert-to">Convert to</label>
          <Select
            inputId="convert-to"
            options={options}
            value={options.find(option => option.value === toId) ?? null}
            onChange={option => setToId(option?.value ?? '')}
            getOptionLabel={option =>
              `${option.coin.symbol} ${option.coin.name}`
            }
            formatOptionLabel={option => <CoinOption coin={option.coin} />}
            placeholder="Select a coin"
          />
        </Field>

        <Result>
          <span id="convert-result-label">Result</span>
          <output
            aria-labelledby="convert-result-label"
            htmlFor="convert-from convert-amount convert-to"
          >
            {resultText}
          </output>
        </Result>
      </ConverterForm>
      <Description>
        Choose two coins from today’s top 100 and enter an amount. The result is
        calculated from CoinGecko’s current EUR prices
        {updatedAt ? ` (as of ${formatTime.format(updatedAt)})` : ''} and does
        not include exchange fees.
      </Description>
    </Wrapper>
  );
}

export default Converter;

const Wrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 365px;
  padding: 5px 16px 120px;
  h2 {
    font-size: 1.8rem;
    font-weight: 500;
    text-align: center;
  }
`;

const ConverterForm = styled.form`
  padding: 14px;
  background: #e9ecff;
  box-shadow:
    0 3px 6px rgba(0, 0, 0, 0.16),
    0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 10px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  label {
    font-weight: 700;
    font-size: 1.05rem;
  }
`;

const OptionLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  small {
    color: #4f5469;
  }
`;

const AmountInput = styled.div`
  position: relative;
  input {
    width: 100%;
    height: 40px;
    padding: 0 64px 0 12px;
    font-size: 1.1rem;
    border: 1px solid #6b6e76;
    border-radius: 4px;
    background: #fff;
  }
  span {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
  }
`;

const FieldError = styled.p`
  color: #b3261e;
`;

const SwapButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  width: 100%;
  color: #fff;
  font-size: 1.05rem;
  cursor: pointer;
  background-color: #5a49f0;
  border: none;
  border-radius: 4px;
`;

const Result = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  span {
    font-weight: 700;
  }
  output {
    display: block;
    min-height: 40px;
    padding: 9px 12px;
    background: #fff;
    border-radius: 4px;
    overflow-wrap: anywhere;
  }
`;

const Description = styled.p`
  margin: 15px 0;
  padding: 24px 16px;
  box-shadow:
    0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23);
  border-radius: 10px;
  background: #e9ecff;
`;
