import { useEffect } from 'react';
import useStore from '../hooks/useStore.js';
import styled from 'styled-components';
import Select from 'react-select';

const Converter = ({ coins, currency }) => {
  const setConvert = useStore(state => state.setConvert);
  const convert = useStore(state => state.convert);
  const coinsPaprika = useStore(state => state.coinsPaprika);
  const convertFetch = useStore(state => state.convertFetch);

  let options = [];

  useEffect(() => {
    useStore
      .getState()
      .getData(`https://api.coinpaprika.com/v1/coins`, 'coinsPaprika');
  }, [currency]);

  useEffect(() => {
    if (convert.from && convert.to) {
      useStore
        .getState()
        .getData(
          `https://api.coinpaprika.com/v1/price-converter?base_currency_id=${convert.from.id}&quote_currency_id=${convert.to.id}&amount=${convert.amount}`,
          'convertFetch'
        );
    }
  }, [convert.from, convert.to, convert.amount]);

  const createOptions = () => {
    options = coinsPaprika.data?.slice(0, 100).map((coin, index) => {
      return {
        label: coin.symbol,
        value: coin.name,
        obj: coin,
        icon: (
          <img
            src={`https://static.coinpaprika.com/coin/${coin.id}/logo-thumb.png`}
            height="30"
            width="30"
            alt={coin.id}
          ></img>
        ),
      };
    });
  };
  createOptions();

  // handle onChange event of the dropdown
  const handleChange = field => event => {
    if (field === 'convertFrom') {
      setConvert('from', event.obj);
    } else {
      setConvert('to', event.obj);
    }
  };

  const findOptionById = selectedOption => {
    const name = selectedOption;
    return options?.findIndex(option => option.obj.id === name);
  };
  const handleSwap = () => {
    const temp = convert.from;
    setConvert('from', convert.to);
    setConvert('to', temp);
  };

  const getLabelFrom = e => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {e.icon}
        <span style={{ marginLeft: 5 }}>{e.label}</span>
      </div>
    );
  };

  return (
    <Wrapper>
      <h2>Crypto Currency Converter</h2>
      <ConverterForm aria-label="Convert crypto currency">
        <h3>Convert from </h3>
        <SelectContainer>
          <label>
            <Select
              isDisabled={convertFetch?.loading ? true : false}
              value={
                convert.from.id
                  ? options[findOptionById(convert.from.id)]
                  : null
              }
              options={options}
              aria-label="Currrency from"
              name="Currency from"
              onChange={handleChange('convertFrom')}
              getOptionLabel={getLabelFrom}
            />
          </label>
        </SelectContainer>
        <TextContainer>
          <label>
            <input
              type="number"
              onChange={e => {
                setConvert('amount', Number(e.target.value));
              }}
              aria-label="Enter amount"
              value={convert.amount}
            ></input>
          </label>
          <span>{convert.from?.symbol}</span>
        </TextContainer>

        <SvgContainer>
          <button
            aria-label="swap currencys"
            type="button"
            disabled={convertFetch?.loading ? true : false}
            onClick={handleSwap}
          >
            <svg
              aria-label="swap icon"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z" />
            </svg>
          </button>
        </SvgContainer>

        {convert.to && convert.from ? (
          <TextContainer>
            <label>
              <input
                aria-label="Search"
                readOnly={true}
                value={
                  convertFetch.data?.price?.toFixed(5)
                    ? convertFetch.data?.price?.toFixed(5)
                    : ''
                }
              ></input>
            </label>
            <span>{convert.to?.symbol}</span>
          </TextContainer>
        ) : null}
        <SelectContainer>
          <label>
            <Select
              isDisabled={convertFetch?.loading ? true : false}
              value={
                convert.to.id ? options[findOptionById(convert.to.id)] : null
              }
              options={options}
              aria-label="Currrency to convert to"
              name="Currencys"
              onChange={handleChange('convertTo')}
              getOptionLabel={getLabelFrom}
            />
          </label>
        </SelectContainer>
        <h3>Covert to</h3>
      </ConverterForm>
      {convert.to && convert.from ? (
        <ExchangeFees>
          <ExchangeImage>
            <svg
              width="40"
              height="40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100%" height="100%" />
              <g class="currentLayer">
                <path
                  d="M20.001 17v-1m0 7v1m-1.735-1.714v0c.256.44.726.713 1.236.717h1.096v0a1.404 1.404 0 0 0 .34-2.766l-1.874-.471v0a1.404 1.404 0 0 1 .34-2.767H20.5v0c.51.003.978.275 1.235.714"
                  stroke="#160042"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M20 11v0a9 9 0 1 1-9 9v0a9 9 0 0 1 9-9"
                  stroke="#160042"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M20 11v0a9 9 0 1 1-9 9v0a9 9 0 0 1 9-9"
                  stroke="#160042"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
          </ExchangeImage>

          <ExchangeText>
            <p>Exchange Fee</p>
            <p>
              <span>0.10%</span>
            </p>
          </ExchangeText>
          <ExchangePrice>
            <p>$25</p>
          </ExchangePrice>
        </ExchangeFees>
      ) : null}
      <Description>
        Simply choose two different cryptocurrency's from the current top 100,
        enter the amount of units you wish to convert and you'll see the
        conversion result of the chosen currencies.
      </Description>
    </Wrapper>
  );
};

export default Converter;

const ConverterForm = styled.form`
  padding: 14px;
  background: #e9ecff;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 10px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;

  h3 {
    align-self: center;
    margin: 10px 0;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 5px;
    margin-top: 20px;
  }
`;

const SelectContainer = styled.div`
  display: flex;
  justify-content: center;
  label {
    width: 150px;
  }
`;

const Wrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 365px;
  padding: 5px;
  padding-bottom: 350px;
  h2 {
    font-size: 1.8rem;
    font-weight: 500;
    text-align: center;
  }
`;

const TextContainer = styled.div`
  display: inline-block;
  position: relative;
  text-align: center;
  margin-bottom: 15px;
  margin-top: 15px;

  span {
    position: absolute;
    top: 11px;
    right: 40px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }

  input {
    margin: 0 auto;
    width: 80%;
    height: 40px;
    padding: 0 15px;
    font-size: 1.1rem;
    border: 1px solid #999;
    border-radius: 3px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  }
  input:focus {
    border: 1px solid #675afe;
    padding: 0 15px;
  }
`;

const SvgContainer = styled.div`
  margin: 15px 0;
  button {
    height: 35px;
    padding: top;
    width: 100%;
    color: #fff;
    font-size: 1.1rem;
    cursor: pointer;
    background-color: #675afe;
    border: none;
  }
`;

const ExchangeFees = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 360px;
  padding: 24px 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  border-radius: 10px;
  margin-top: 20px;
  background: #e9ecff;
`;

const ExchangeImage = styled.div`
  width: 40px;
  height: 40px;

  border-radius: 8px;

  background-color: rgba(212, 212, 212, 0.5);
`;

const ExchangeText = styled.div`
  margin-left: 15px;
  color: #6b7194;
  span {
    color: #160042;
    font-size: 1rem;
    font-weight: bold;
  }
`;

const ExchangePrice = styled.div`
  color: #160042;
  text-align: right;
  align-self: center;
  flex: 1;
  font-weight: bold;
`;

const Description = styled.p`
  margin: 15px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 360px;
  padding: 24px 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  border-radius: 10px;
  background: #e9ecff;
`;
