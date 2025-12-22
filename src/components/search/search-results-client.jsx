"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { searchBooksAsync, setSearchResults } from "../../../redux/features/booksSlice";
import { getBookCoverUrl } from "../../../redux/services/bookService";
import { BookCover } from "@/components/ui/book-cover";

// Extract a valid book ID from Open Library key
function extractBookId(key) {
  if (!key) return '';
  
  // Handle different key formats
  if (key.startsWith('/works/')) {
    return key.split('/').pop();
  } else if (key.includes('/')) {
    return key.split('/').pop();
  } else {
    return key;
  }
}

export function SearchResultsClient({ initialResults, initialQuery, initialError }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || initialQuery;
  const dispatch = useDispatch();
  
  // Get all state directly from Redux - single source of truth
  const { searchResults, loading, error, currentQuery } = useSelector((state) => state.books);

  // Effect to handle initial data and query changes
  useEffect(() => {
    // On first render, if we have SSR data, update Redux
    if (initialResults && initialResults.docs && initialResults.docs.length > 0 && initialQuery === query) {
      // Update Redux with our server-side fetched results
      dispatch(setSearchResults({ results: initialResults, query }));
      return;
    }

    // If query changes or we need fresh data
    if (query && query !== currentQuery) {
      dispatch(searchBooksAsync(query));
    }
  }, [dispatch, initialResults, initialQuery, query, currentQuery]);

  // Determine which data to use for rendering
  const displayResults = searchResults || initialResults || { docs: [], numFound: 0 };
  const displayError = error || initialError;
  const displayBooks = displayResults?.docs || [];
  const displayNumFound = displayResults?.numFound || 0;

  // Handle error state
  if (displayError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Error</h1>
        <p className="text-red-500">Failed to fetch results: {displayError}</p>
        <Button asChild className="mt-4">
          <Link href="/">Back to Search</Link>
        </Button>
      </div>
    );
  }

  // Handle empty results
  if (displayBooks.length === 0 && !loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          No results found for &quot;{query}&quot;
        </h1>
        <p className="mb-4">Try a different search term or browse popular books.</p>
        <Button asChild>
          <Link href="/">Back to Search</Link>
        </Button>
      </div>
    );
  }

  // Handle loading state for client-side navigation
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Searching for &quot;{query}&quot;...
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(8).fill(null).map((_, index) => (
            <div key={index} className="border rounded-lg overflow-hidden shadow-sm animate-pulse">
              <div className="aspect-[2/3] bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        Search Results for &quot;{query}&quot;
      </h1>
      <p className="mb-6 text-gray-600">Found {displayNumFound} books</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayBooks.map((book) => {
          const coverId = book.cover_i;
          const coverUrl = coverId 
            ? getBookCoverUrl(coverId) 
            : null;
          
          // Handle multiple authors or no authors
          const authorName = book.author_name 
            ? book.author_name[0] 
            : 'Unknown Author';
          
          // Get a valid book ID
          const bookId = extractBookId(book.key);
            
          return (
            <div key={book.key} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <Link href={`/book/${bookId}`}>
                <div className="aspect-[2/3] bg-gray-100 relative">
                  <BookCover
                    coverUrl={coverUrl}
                    title={book.title}
                    size="medium"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate" title={book.title}>
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-sm truncate" title={authorName}>
                    {authorName}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {book.first_publish_year ? `Published: ${book.first_publish_year}` : ''}
                  </p>
                  <Button variant="outline" className="w-full mt-2" size="sm">
                    View Details
                  </Button>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}