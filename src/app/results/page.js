import { Suspense } from 'react';
import { SearchResultsClient } from '@/components/search/search-results-client';
import { searchBooks } from '../../../redux/services/bookService';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SearchResultsLoading from './loading';

// Generate metadata for the page
export async function generateMetadata({ searchParams }) {
  const query = await searchParams || '';
  
  return {
    title: `Search results for "${query}" - BookSearch`,
    description: `Browse search results for "${query}" on BookSearch. Find books, authors, and more.`,
  };
}

// Server component for search results
export default async function ResultsPage({ searchParams }) {
  // Extract query properly
  const query = await searchParams || '';
  
  // If no query, show empty state
  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">No search query</h1>
        <p className="mb-4">Please enter a search term to find books.</p>
        <Button asChild>
          <Link href="/">Back to Search</Link>
        </Button>
      </div>
    );
  }

  // Fetch results on the server
  let searchResults;
  let error = null; 
  
  try {
    searchResults = await searchBooks(query);
  } catch (err) {
    console.error('Error fetching search results:', err);
    error = err.message || 'Error fetching search results';
    searchResults = { docs: [], numFound: 0 };
  }
  
  // Wrap client component in Suspense boundary
  return (
    <Suspense fallback={<SearchResultsLoading query={query} />}>
      <SearchResultsClient 
        initialResults={searchResults}
        initialQuery={query}
        initialError={error}
      />
    </Suspense>
  );
}