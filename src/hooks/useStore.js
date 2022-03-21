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
    coins: initialize(),
    isVisible: false,
    setVisible(visibility) {
      console.log('drinnen');
      set({
        isVisible: visibility,
      });
    },
    chartHistory: initialize(),
    search: {
      input: '',
      error: null,
    },
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
    setBookmark(id) {
      const allCoins = get().coins;
      const bookmarkedCoins = allCoins.data.map(coin => {
        if (coin.id === id) {
          return { ...coin, isBookmarked: !coin.isBookmarked };
        } else {
          return coin;
        }
      });
      set({
        coins: {
          data: bookmarkedCoins,
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
