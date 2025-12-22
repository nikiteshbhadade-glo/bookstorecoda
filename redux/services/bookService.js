import axios from 'axios';

// Function to search books using Open Library API
export const searchBooks = async (query) => {
  try {
    const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
    
    return response.data;
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};

// Function to get book cover URL
export const getBookCoverUrl = (coverId, size = 'M') => {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};

// Function to get book details by ID
export const getBookDetails = async (id) => {
  try {
    const response = await axios.get(`https://openlibrary.org/works/${id}.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw error;
  }
};