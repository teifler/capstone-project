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

  console.log(currency);

  return (
    <div>
      <Select
        options={options}
        isSearchable={false}
        value={options.label}
        onChange={option => setCurrency(option.value)}
      ></Select>
    </div>
  );
}

export default SelectCurrency;
