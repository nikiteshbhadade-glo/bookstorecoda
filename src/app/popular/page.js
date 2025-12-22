"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { getBookCoverUrl } from "../../../redux/services/bookService";
import { BookCover } from "@/components/ui/book-cover";

export default function Popular() {
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted to prevent hydration mismatch
    setIsMounted(true);
    
    const fetchPopularBooks = async () => {
      try {
        setLoading(true);
        // Fetch trending books from Open Library
        const response = await axios.get(
          "https://openlibrary.org/trending/daily.json?limit=12",
          { timeout: 8000 }
        );
        
        // Process and validate book data before setting state
        const validBooks = (response.data.works || []).filter(book => 
          book && book.title && book.key && typeof book.key === 'string'
        );
        
        setPopularBooks(validBooks);
      } catch (err) {
        console.error("Error fetching popular books:", err);
        setError("Failed to load popular books.");
      } finally {
        setLoading(false);
      }
    };

    if (isMounted) {
      fetchPopularBooks();
    }
  }, [isMounted]);

  // Handle loading state - show consistently during SSR and client loading
  if (loading || !isMounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Popular Books</h1>
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

  // Handle error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Popular Books</h1>
        <div className="p-4 border rounded-md bg-red-50 text-red-600">
          <p>{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Helper function to safely extract author name
  const getAuthorName = (book) => {
    if (book.author_name && book.author_name.length > 0) {
      return book.author_name[0];
    }
    if (book.authors && book.authors.length > 0) {
      return book.authors[0]?.name || 'Unknown Author';
    }
    return 'Unknown Author';
  };

  // Helper function to safely extract book ID from key
  const getBookId = (key) => {
    if (!key || typeof key !== 'string') return '';
    return key.split('/').pop() || '';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Popular Books Today</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {popularBooks.map((book) => {
          const coverId = book.cover_i || (book.cover_id ? book.cover_id : null);
          const coverUrl = coverId ? getBookCoverUrl(coverId) : null;
          const authorName = getAuthorName(book);
          const bookId = getBookId(book.key);
            
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
                  <h3 className="font-semibold truncate" title={book.title}>
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-sm truncate" title={authorName}>
                    {authorName}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-600">
                      {book.edition_count} {book.edition_count === 1 ? 'edition' : 'editions'}
                    </span>
                  </div>
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