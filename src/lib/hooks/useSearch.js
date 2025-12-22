"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { searchBooksAsync } from "../../../redux/features/booksSlice";

/**
 * Custom hook for handling book search functionality
 * @returns {Object} Search state and functions
 */
export function useSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Get search state directly from Redux
  const { loading: isSearching, currentQuery } = useSelector((state) => state.books);

  // Prevent hydration mismatch by ensuring we only run on client
  useEffect(() => {
    setIsMounted(true);
    
    // Sync local state with Redux state when component mounts
    if (currentQuery) {
      setSearchQuery(currentQuery);
    }
  }, [currentQuery]);

  /**
   * Handle search submission
   * @param {Event} e - Form submit event
   */
  const handleSearch = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      try {
        // Dispatch search action to Redux
        await dispatch(searchBooksAsync(trimmedQuery));
        
        // Navigate to the results page
        router.push(`/results?q=${encodeURIComponent(trimmedQuery)}`);
      } catch (error) {
        console.error("Search failed:", error);
      }
    }
  }, [dispatch, router, searchQuery]);

  /**
   * Perform search with a specific query
   * @param {string} query - Search query to use
   */
  const searchWithQuery = useCallback(async (query) => {
    if (!query) return;
    
    try {
      setSearchQuery(query);
      await dispatch(searchBooksAsync(query));
      router.push(`/results?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error("Search failed:", error);
    }
  }, [dispatch, router]);

  return {
    searchQuery,
    setSearchQuery,
    isSearching,
    handleSearch,
    searchWithQuery,
    isMounted
  };
}