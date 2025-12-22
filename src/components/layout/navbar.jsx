"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { useSearch } from "@/lib/hooks/useSearch";
import { useState, useEffect } from "react";
import { ClientOnly } from "@/components/ui/client-only";

export default function Navbar() {
  const { searchQuery, setSearchQuery, isSearching, handleSearch, isMounted } = useSearch();
  const { favorites } = useSelector(state => state.books);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Only update favorites count after hydration
  useEffect(() => {
    if (isMounted) {
      setFavoritesCount(favorites.length);
    }
  }, [favorites.length, isMounted]);
  
  return (
    <nav className="border-b sticky top-0 z-10 bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            BookSearch
          </Link>
          <div className="ml-10 hidden space-x-4 md:flex">
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/popular">Popular</Link>
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Only render search form on client to prevent hydration mismatch */}
          <ClientOnly fallback={
            <div className="w-[200px] md:w-[300px] h-10 rounded-md border border-input bg-background"></div>
          }>
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search books..."
                className="w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isSearching}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon-sm" 
                className="absolute right-1 top-1/2 -translate-y-1/2"
                disabled={isSearching}
              >
                <Search className={`h-4 w-4 ${isSearching ? 'animate-spin' : ''}`} />
              </Button>
            </form>
          </ClientOnly>
          
          <Button variant="outline" asChild className="gap-1">
            <Link href="/favorites">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Favorites</span>
              <ClientOnly>
                {favoritesCount > 0 && (
                  <span className="ml-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </ClientOnly>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}