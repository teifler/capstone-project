import Select from 'react-select';
import useStore from '../hooks/useStore.js';

function SelectCurrency() {
  const { currency, setCurrency } = useStore(state => state);

  const optionsMenu = [
    { value: 'eur', label: 'Euro' },
    { value: 'usd', label: 'United States dollar' },
    { value: 'cad', label: 'Canadian dollar' },
  ];

  console.log(currency);

  return (
    <div>
      <Select
        options={optionsMenu}
        isSearchable={false}
        onChange={option => {
          setCurrency(option);
        }}
        value={currency}
        label={currency}
      ></Select>
    </div>
  );
}

export default SelectCurrency;
