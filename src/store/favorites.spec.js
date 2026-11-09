import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  MAX_FAVORITES,
  STORAGE_KEY,
  migrateFavorites,
  sanitizeFavorites,
  useFavorites,
} from './favorites.js';

function stored() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

async function hydrateFrom(value) {
  localStorage.setItem(
    STORAGE_KEY,
    typeof value === 'string' ? value : JSON.stringify(value)
  );
  await useFavorites.persist.rehydrate();
  return useFavorites.getState();
}

beforeEach(() => {
  localStorage.clear();
  useFavorites.setState({ favorites: [] });
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe('favourites store', () => {
  it('adds and removes a coin and persists version 1 under CryptoCloud', () => {
    useFavorites.getState().toggleFavorite('bitcoin');
    expect(useFavorites.getState().favorites).toEqual(['bitcoin']);
    expect(stored()).toEqual({ state: { favorites: ['bitcoin'] }, version: 1 });

    useFavorites.getState().toggleFavorite('bitcoin');
    expect(useFavorites.getState().favorites).toEqual([]);
  });

  it.each(['__proto__', '/evil.example', '\\evil.example', 'Bitcoin', ''])(
    'ignores the invalid id %j',
    id => {
      useFavorites.getState().toggleFavorite(id);
      expect(useFavorites.getState().favorites).toEqual([]);
    }
  );

  it.each(['__proto__', 'constructor', 'prototype'])(
    'never writes to Object.prototype for %j',
    id => {
      // "constructor" and "prototype" are valid slugs, so they are stored, but
      // only as strings in an array: no object is indexed by a coin id.
      useFavorites.getState().toggleFavorite(id);
      expect({}.bookmarked).toBeUndefined();
      expect(Object.prototype).not.toHaveProperty('bookmarked');
      expect(Object.bookmarked).toBeUndefined();
      expect(Object.getPrototypeOf(useFavorites.getState().favorites)).toBe(
        Array.prototype
      );
    }
  );

  it('stops at the maximum number of favourites', () => {
    const ids = Array.from({ length: MAX_FAVORITES }, (_, i) => `coin-${i}`);
    useFavorites.setState({ favorites: ids });
    useFavorites.getState().toggleFavorite('one-more');
    expect(useFavorites.getState().favorites).toHaveLength(MAX_FAVORITES);
  });
});

describe('rehydration from localStorage', () => {
  it('migrates the 2022 shape and keeps the visitor’s tracked coins', async () => {
    const state = await hydrateFrom({
      state: {
        meta: {
          coins: {
            bitcoin: { bookmarked: true },
            ethereum: { bookmarked: false },
            'the-open-network': { bookmarked: true },
          },
        },
      },
      version: 0,
    });
    expect(state.favorites).toEqual(['bitcoin', 'the-open-network']);
    expect(stored()).toEqual({
      state: { favorites: ['bitcoin', 'the-open-network'] },
      version: 1,
    });
  });

  it('does not let stored data override other keys or actions', async () => {
    const state = await hydrateFrom({
      state: {
        meta: null,
        currency: 'usd&per_page=250',
        toggleFavorite: 'not a function',
        favorites: ['bitcoin'],
      },
      version: 1,
    });
    expect(state.favorites).toEqual(['bitcoin']);
    expect(state).not.toHaveProperty('currency');
    expect(state).not.toHaveProperty('meta');
    expect(typeof state.toggleFavorite).toBe('function');
  });

  it('turns the A4 proof payload into an empty, working store', async () => {
    const state = await hydrateFrom({
      state: { meta: null, currency: 'usd&per_page=250' },
      version: 0,
    });
    expect(state.favorites).toEqual([]);
    expect(state).not.toHaveProperty('currency');
    state.toggleFavorite('bitcoin');
    expect(useFavorites.getState().favorites).toEqual(['bitcoin']);
  });

  it('filters invalid, duplicate and polluting ids', async () => {
    const state = await hydrateFrom(
      '{"state":{"favorites":["bitcoin","__proto__",5,null,"bitcoin","/evil.example","ethereum"]},"version":1}'
    );
    expect(state.favorites).toEqual(['bitcoin', 'ethereum']);
  });

  it('ignores a v0 map that carries a __proto__ key', async () => {
    const state = await hydrateFrom(
      '{"state":{"meta":{"coins":{"__proto__":{"bookmarked":true},"bitcoin":{"bookmarked":true}}}},"version":0}'
    );
    expect(state.favorites).toEqual(['bitcoin']);
    expect({}.bookmarked).toBeUndefined();
  });

  it.each([
    ['broken JSON', '{not json'],
    ['a bare string', '"CryptoCloud"'],
    ['null', 'null'],
    ['a future version', '{"state":{"favorites":"bitcoin"},"version":7}'],
    [
      'a version string',
      '{"state":{"favorites":{"0":"bitcoin"}},"version":"1"}',
    ],
  ])('falls back to an empty list for %s', async (_, raw) => {
    const state = await hydrateFrom(raw);
    expect(state.favorites).toEqual([]);
  });
});

describe('migrateFavorites / sanitizeFavorites', () => {
  it('handles odd v0 shapes', () => {
    expect(migrateFavorites(undefined, 0)).toEqual({ favorites: [] });
    expect(migrateFavorites({ meta: { coins: [] } }, 0)).toEqual({
      favorites: [],
    });
    expect(
      migrateFavorites(
        { meta: { coins: { bitcoin: { bookmarked: 'yes' } } } },
        0
      )
    ).toEqual({ favorites: [] });
  });

  it('caps the list', () => {
    const many = Array.from({ length: 150 }, (_, i) => `c${i}`);
    expect(sanitizeFavorites(many)).toHaveLength(MAX_FAVORITES);
  });
});
