import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { isValidCoinId } from '../lib/validate.js';

// The key and the v0 shape come from the 2022 app; returning visitors keep
// their tracked coins.
export const STORAGE_KEY = 'CryptoCloud';
export const STORAGE_VERSION = 1;
export const MAX_FAVORITES = 100;

// Only a list of unique, valid coin ids ever reaches the store.
export function sanitizeFavorites(value) {
  if (!Array.isArray(value)) return [];
  const ids = [];
  for (const id of value) {
    if (isValidCoinId(id) && !ids.includes(id)) ids.push(id);
    if (ids.length === MAX_FAVORITES) break;
  }
  return ids;
}

// v0 (2022): { meta: { coins: { [id]: { bookmarked: boolean } } } }
// v1:        { favorites: string[] }
export function migrateFavorites(persisted, version) {
  if (version === 0) {
    const coins = persisted?.meta?.coins;
    if (!coins || typeof coins !== 'object' || Array.isArray(coins)) {
      return { favorites: [] };
    }
    const ids = Object.entries(coins)
      .filter(([id, entry]) => isValidCoinId(id) && entry?.bookmarked === true)
      .map(([id]) => id);
    return { favorites: sanitizeFavorites(ids) };
  }
  return { favorites: sanitizeFavorites(persisted?.favorites) };
}

export const useFavorites = create(
  persist(
    set => ({
      favorites: [],
      toggleFavorite(id) {
        if (!isValidCoinId(id)) return;
        set(state => {
          if (state.favorites.includes(id)) {
            return { favorites: state.favorites.filter(f => f !== id) };
          }
          if (state.favorites.length >= MAX_FAVORITES) return state;
          return { favorites: [...state.favorites, id] };
        });
      },
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ favorites: state.favorites }),
      migrate: migrateFavorites,
      // zustand's default merge spreads every stored key over the live store
      // (actions included). Take the validated id list and nothing else.
      merge: (persisted, current) => ({
        ...current,
        favorites: sanitizeFavorites(persisted?.favorites),
      }),
    }
  )
);
