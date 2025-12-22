import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchBooks } from '../services/bookService';

// Async thunk for searching books
export const searchBooksAsync = createAsyncThunk(
  'books/searchBooks',
  async (query, { rejectWithValue }) => {
    try {
      const response = await searchBooks(query);
      return { results: response, query };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get favorites from localStorage if available
const getFavoritesFromStorage = () => {
  if (typeof window !== 'undefined') {
    const storedFavorites = localStorage.getItem('bookFavorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  }
  return [];
};

const initialState = {
  searchResults: null,
  currentQuery: '',
  loading: false,
  error: null,
  favorites: getFavoritesFromStorage(),
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = null;
      state.currentQuery = '';
    },
    // Add a specific action for setting search results from SSR
    setSearchResults: (state, action) => {
      state.searchResults = action.payload.results;
      state.currentQuery = action.payload.query;
      state.loading = false;
      state.error = null;
    },
    addToFavorites: (state, action) => {
      // Check if book already exists in favorites
      const exists = state.favorites.some(book => book.key === action.payload.key);
      if (!exists) {
        state.favorites.push(action.payload);
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('bookFavorites', JSON.stringify(state.favorites));
        }
      }
    },
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter(book => book.key !== action.payload);
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('bookFavorites', JSON.stringify(state.favorites));
      }
    },
    // This action is used when favorites are loaded from localStorage on app init
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchBooksAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBooksAsync.fulfilled, (state, action) => {
        state.searchResults = action.payload.results;
        state.currentQuery = action.payload.query;
        state.loading = false;
      })
      .addCase(searchBooksAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearSearchResults,
  setSearchResults,
  addToFavorites, 
  removeFromFavorites, 
  setFavorites 
} = booksSlice.actions;

export default booksSlice.reducer;