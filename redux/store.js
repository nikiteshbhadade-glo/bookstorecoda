import { configureStore } from '@reduxjs/toolkit';
import booksReducer, { setFavorites } from './features/booksSlice';

export const store = configureStore({
  reducer: {
    books: booksReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Sync with localStorage
if (typeof window !== 'undefined') {
  // Load favorites from localStorage on app initialization
  const storedFavorites = localStorage.getItem('bookFavorites');
  if (storedFavorites) {
    store.dispatch(setFavorites(JSON.parse(storedFavorites)));
  }

  // Subscribe to state changes to update localStorage
  store.subscribe(() => {
    const { favorites } = store.getState().books;
    localStorage.setItem('bookFavorites', JSON.stringify(favorites));
  });
}

export default store;