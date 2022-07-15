import { useRef } from 'react';
import styled from 'styled-components';
import Select from 'react-select';

import useStore from '../hooks/useStore.js';

function SelectCurrency() {
  const { currency, setCurrency } = useStore(state => state);

  const options = [
    { value: 'eur', label: 'Euro' },
    { value: 'usd', label: 'United States dollar' },
    { value: 'cad', label: 'Canadian dollar', disabled: true },
  ];

  const handleChange = e => {
    setCurrency(e.value);
  };

  console.log(currency);

  return (
    <div>
      <Select
        options={options}
        isSearchable={false}
        value={currency}
        defaultValue={currency}
        onChange={handleChange}

        // theme={theme => ({
        //   ...theme,
        //   borderRadius: 0,
        //   colors: {
        //     ...theme.colors,
        //     primary25: 'hotpink',
        //     primary: 'black',
        //   },
        // })}
      ></Select>
    </div>
  );
}

export default SelectCurrency;
