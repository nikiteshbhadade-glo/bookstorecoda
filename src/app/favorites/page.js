"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { removeFromFavorites } from "../../../redux/features/booksSlice";
import { getBookCoverUrl } from "../../../redux/services/bookService";
import { BookCover } from "@/components/ui/book-cover";

export default function Favorites() {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.books);
  const [isMounted, setIsMounted] = useState(false);
  const [clientFavorites, setClientFavorites] = useState([]);
  
  // Fix hydration issues by only using client-side data after mount
  useEffect(() => {
    setIsMounted(true);
    setClientFavorites(favorites);
  }, [favorites]);

  const handleRemoveFavorite = (bookKey) => {
    dispatch(removeFromFavorites(bookKey));
  };

  // Show skeleton loader during SSR/hydration
  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Favorite Books</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden shadow-sm animate-pulse">
              <div className="aspect-[2/3] bg-gray-200"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Favorite Books</h1>
      
      {clientFavorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <h2 className="text-xl font-medium mb-4">No favorites yet</h2>
            <p className="text-gray-600 mb-8">
              When you find books you love, save them to your favorites for quick access.
            </p>
            <Button asChild>
              <Link href="/">Discover Books</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {clientFavorites.map((book) => {
            const coverUrl = book.coverImage || 
              (book.cover_i ? getBookCoverUrl(book.cover_i) : null) || 
              (book.covers && book.covers[0] ? getBookCoverUrl(book.covers[0]) : null);
            
            const bookId = book.key ? book.key.split('/').pop() : '';
            
            return (
              <div key={book.key} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group">
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
                    <p className="text-gray-600 text-sm truncate" title={book.author}>
                      {book.author || 'Unknown Author'}
                    </p>
                  </div>
                </Link>
                
                {/* Remove button */}
                <Button 
                  variant="destructive"
                  size="icon-sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveFavorite(book.key);
                  }}
                  aria-label="Remove from favorites"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}