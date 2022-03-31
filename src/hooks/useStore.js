import create from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

import { produce } from 'immer';

function initialize() {
  return {
    data: null,
    loading: true,
    error: null,
  };
}

const useStore = create(
  persist(
    (set, get) => {
      return {
        currency: 'eur',
        days: 1,
        amount: 0,
        convertFetch: {
          data: null,
          loading: false,
          error: null,
        },
        convert: {
          from: '',
          to: '',
          amount: 1,
        },
        setConvert(key, value) {
          const objConvert = get().convert;
          set({
            convert: {
              ...objConvert,
              [key]: value,
            },
          });
          set({
            [key]: value,
          });
        },
        meta: {
          coins: {},
        },
        setMeta(key, id, partial) {
          set(
            produce(draft => {
              if (draft.meta[key][id]) {
                Object.entries(partial).forEach(entry => {
                  const [key_, value_] = entry;
                  draft.meta[key][id][key_] = value_;
                });
              } else {
                draft.meta[key][id] = partial;
              }
            })
          );
        },
        search: {
          input: '',
          error: null,
        },
        coinsPaprika: initialize(),
        coins: initialize(),
        singleCoin: initialize(),
        isVisible: false,
        setVisible(visibility) {
          set({
            isVisible: visibility,
          });
        },
        chartHistory: initialize(),
        setSearchInput(userInput, errorState) {
          set({
            search: {
              input: userInput,
              error: errorState,
            },
          });
        },
        setDays(selectedTimeframe) {
          set({
            days: selectedTimeframe,
          });
        },
        setCurrency(newCurrency) {
          set({
            currency: newCurrency,
          });
        },
        async getData(url, key) {
          const { data: previousData } = get()[key];
          set({
            [key]: {
              data: previousData,
              loading: true,
              error: null,
            },
          });
          try {
            const { data } = await axios.get(url);
            setTimeout(
              () =>
                set({
                  [key]: {
                    data,
                    loading: false,
                    error: null,
                  },
                }),
              2000
            );
          } catch (error) {
            set({
              [key]: {
                data: previousData,
                loading: false,
                error,
              },
            });
          }
        },
      };
    },
    {
      name: 'CryptoCloud',
      partialize: state => ({
        meta: state.meta,
      }),
    }
  )
);

export default useStore;
