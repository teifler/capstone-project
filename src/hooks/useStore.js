import create from 'zustand';
import axios from 'axios';

function initialize() {
  return {
    data: null,
    loading: true,
    error: null,
  };
}

const useStore = create((set, get) => {
  return {
    currency: 'eur',
    days: 1,
    setDays(selectedTimeframe) {
      set({
        days: selectedTimeframe,
      });
    },
    coins: initialize(),
    chartHistory: initialize(),
    setCurrency(newCurrency) {
      set({
        currency: newCurrency,
      });
    },
    setBookmark(id) {
      const allCoins = get().coins;
      console.log('allCOin', allCoins.data);
      const temp = allCoins.data.map(coin => {
        console.log('in map', coin);
        if (coin.id === id) {
          return { ...coin, isBookmarked: !coin.isBookmarked };
        } else {
          return coin;
        }
      });
      console.log('temp', temp);
      set({
        coins: {
          data: temp,
          loading: false,
          error: null,
        },
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
});

export default useStore;
