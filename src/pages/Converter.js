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
        label: coin.name,
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
        <TextContainer>
          <label>
            <p>Enter Amount</p>
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
        <div className="from">
          <p>From</p>
          <Select
            isDisabled={convertFetch?.loading ? true : false}
            value={
              convert.from.id ? options[findOptionById(convert.to.id)] : null
            }
            options={options}
            aria-label="Currrency to convert from"
            name="Currencys"
            onChange={handleChange('convertFrom')}
            getOptionLabel={getLabelFrom}
          />
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
                width="30"
                height="30"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z" />
              </svg>
            </button>
          </SvgContainer>
        </div>

        <div>
          <p>To</p>
          <Select
            isDisabled={convertFetch?.loading ? true : false}
            value={
              convert.from.id ? options[findOptionById(convert.to.id)] : null
            }
            options={options}
            aria-label="Currrency to convert to"
            name="Currencys"
            onChange={handleChange('convertTo')}
            getOptionLabel={getLabelFrom}
          />
        </div>
        <div>
          {convert.to && convert.from ? (
            <TextContainer>
              <label>
                <p>Result</p>
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
        </div>
      </ConverterForm>
    </Wrapper>
  );
};

export default Converter;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  width: 365px;
  padding: 5px;

  h2 {
    font-size: 1.8rem;
    font-weight: 500;
    text-align: center;
  }
`;

const TextContainer = styled.div`
  display: inline-block;
  position: relative;
  overflow: hidden;

  span {
    position: absolute;
    top: 58px;
    right: 5px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
`;
const ConverterForm = styled.form`
  margin: 40px;

  input {
    width: 100%;
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
  p {
    font-size: 1.2rem;
    margin-bottom: 5px;
    margin-top: 20px;
  }

  button {
    height: 45px;
    width: 100%;
    color: #fff;
    font-size: 1.1rem;
    cursor: pointer;
    background-color: #675afe;
    margin-top: 20px;
    border: none;
  }
`;
const SvgContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 35px;
`;

const Amount = styled.div;
