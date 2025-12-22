"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { addToFavorites, removeFromFavorites } from "../../../redux/features/booksSlice";
import { BookCover } from "@/components/ui/book-cover";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function BookDetails({ book }) {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { favorites } = useSelector(state => state.books);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Safely check book properties with error handling
  const getBookProperty = useCallback((obj, path, defaultValue = null) => {
    try {
      const value = path.split('.').reduce((o, p) => (o && o[p] !== undefined) ? o[p] : undefined, obj);
      return value !== undefined ? value : defaultValue;
    } catch (error) {
      console.warn(`Error accessing property path "${path}" on book object:`, error);
      return defaultValue;
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    
    if (book) {
      try {
        // Check if book is already in favorites
        const bookKey = getBookProperty(book, 'key', '');
        const bookExists = favorites.some(favBook => favBook.key === bookKey);
        setIsFavorite(bookExists);
      } catch (error) {
        console.error("Error checking favorites status:", error);
      }
    }
  }, [book, favorites, getBookProperty]);

  const handleFavoriteToggle = () => {
    if (!book) return;
    
    try {
      if (isFavorite) {
        dispatch(removeFromFavorites(book.key));
        setIsFavorite(false);
      } else {
        dispatch(addToFavorites(book));
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  if (!book) return null;

  // Safely format the description with error handling
  const getDescription = () => {
    try {
      const desc = book.description;
      if (!desc) return "No description available.";
      return typeof desc === 'object' && desc.value ? desc.value : desc.toString();
    } catch (error) {
      console.warn("Error formatting book description:", error);
      return "No description available.";
    }
  };

  // Safely extract subject categories with error handling
  const getCategories = () => {
    try {
      return Array.isArray(book.subjects) ? book.subjects.slice(0, 5) : [];
    } catch (error) {
      console.warn("Error extracting book categories:", error);
      return [];
    }
  };

  // Get book properties safely
  const description = getDescription();
  const categories = getCategories();
  const title = getBookProperty(book, 'title', 'Unknown Title');
  const author = getBookProperty(book, 'author', 'Unknown Author');
  const coverImage = getBookProperty(book, 'coverImage');
  const firstPublishDate = getBookProperty(book, 'first_publish_date', 'Unknown');
  const language = getBookProperty(book, 'language');
  const id = getBookProperty(book, 'id', '');
  const ebookAccess = getBookProperty(book, 'ebook_access');

  // Helper to format language display
  const formatLanguage = () => {
    if (!language) return "Unknown";
    if (Array.isArray(language)) return language[0] || "Unknown";
    return language;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/results" className="flex items-center text-blue-600 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Results
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Book Cover */}
        <div className="md:col-span-1">
          <ErrorBoundary fallbackMessage="Could not load book cover">
            <div className="aspect-[2/3] bg-gray-200 rounded-lg shadow-md overflow-hidden relative">
              {isMounted && (
                <BookCover
                  coverUrl={coverImage}
                  title={title}
                  size="large"
                  priority={true}
                />
              )}
            </div>
          
            <div className="mt-4 flex gap-2">
              <Button 
                variant={isFavorite ? "default" : "outline"} 
                className="flex-1"
                onClick={handleFavoriteToggle}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Saved' : 'Add to Favorites'}
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </ErrorBoundary>
        </div>
        
        {/* Book Details */}
        <ErrorBoundary fallbackMessage="Could not load book details">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-xl text-gray-600 mt-1">by {author}</p>
            
            <div className="flex flex-wrap mt-4">
              {categories.map((category, index) => (
                <span key={index} className="mr-2 mb-2 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                  {category}
                </span>
              ))}
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-2">About this Book</h2>
                <p className="text-gray-700">{description}</p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">First Published</h3>
                  <p>{firstPublishDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Language</h3>
                  <p>{formatLanguage()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Open Library ID</h3>
                  <p>{id}</p>
                </div>
                {ebookAccess && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">E-Book Availability</h3>
                    <p className="capitalize">{ebookAccess}</p>
                  </div>
                )}
              </div>
              
              <ErrorBoundary fallbackMessage="Could not load recommendations">
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">You may also like</h2>
                  <p className="text-gray-500 italic">Similar books will appear here based on subject and genre.</p>
                </div>
              </ErrorBoundary>
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}