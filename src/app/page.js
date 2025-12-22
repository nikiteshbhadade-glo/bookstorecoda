"use client";

import { useSearch } from "@/lib/hooks/useSearch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function Home() {
  const { searchQuery, setSearchQuery, isSearching, handleSearch, searchWithQuery, isMounted } = useSearch();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4 md:text-6xl">
          Discover Your Next Favorite Book
        </h1>
        <p className="text-xl mb-12 text-gray-600">
          Search millions of books to find exactly what you're looking for
        </p>
        
        {isMounted ? (
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <Input
              type="search"
              placeholder="Search by title, author, or ISBN..."
              className="w-full h-14 pl-4 pr-12 text-lg rounded-lg shadow-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isSearching}
            />
            <Button 
              type="submit" 
              size="lg"
              className="absolute right-0 top-0 h-14 px-6 rounded-l-none"
              disabled={isSearching}
            >
              <Search className={`h-5 w-5 mr-2 ${isSearching ? 'animate-spin' : ''}`} />
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </form>
        ) : (
          <div className="relative max-w-2xl mx-auto">
            <div className="w-full h-14 rounded-lg shadow-md bg-gray-100"></div>
          </div>
        )}
        
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {isMounted && (
            <>
              <Button 
                variant="outline" 
                onClick={() => searchWithQuery('fantasy')}
              >
                Fantasy
              </Button>
              <Button 
                variant="outline" 
                onClick={() => searchWithQuery('science fiction')}
              >
                Science Fiction
              </Button>
              <Button 
                variant="outline" 
                onClick={() => searchWithQuery('mystery')}
              >
                Mystery
              </Button>
              <Button 
                variant="outline" 
                onClick={() => searchWithQuery('romance')}
              >
                Romance
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}