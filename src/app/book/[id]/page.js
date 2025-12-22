import axios from 'axios';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import BookDetails from '@/components/book/book-details';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { getBookCoverUrl } from '../../../../redux/services/bookService';
 

// Try different API endpoints for book data
async function tryFetchBookData(id) { 
  
  // Try different API endpoints for book data
  const endpoints = [
    `https://openlibrary.org/works/${id}.json`,    // Try works endpoint first
    // `https://openlibrary.org/books/${id}.json`,    // Try books endpoint next
    // `https://openlibrary.org/api/books?bibkeys=ID:${id}&format=json&jscmd=data`,  // Try API endpoint last
    // `https://openlibrary.org/api/volumes/brief/isbn/${id}.json` // Try ISBN endpoint
  ];

  let bookData = null;
  let lastError = null;
  let successEndpoint = null;

  for (const endpoint of endpoints) {
    try {
      console.log(`Attempting to fetch from: ${endpoint}`);
      const response = await axios.get(endpoint, { 
        timeout: 8000,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.data && Object.keys(response.data).length > 0) {
        // For API endpoint format, extract the relevant data
        if (endpoint.includes('/api/books?bibkeys=')) {
          const key = `ID:${id}`;
          if (response.data[key]) {
            bookData = response.data[key];
          }
        } else if (endpoint.includes('/api/volumes/brief/')) {
          if (response.data.records && Object.keys(response.data.records).length > 0) {
            const recordKey = Object.keys(response.data.records)[0];
            bookData = response.data.records[recordKey].data;
          }
        } else {
          bookData = response.data;
        }
        
        if (bookData && Object.keys(bookData).length > 0) {
          successEndpoint = endpoint;
          console.log(`Successfully fetched book data from: ${endpoint}`);
          break;
        }
      }
    } catch (error) {
      lastError = error;
      console.warn(`Attempt failed for endpoint: ${endpoint} - ${error.message}`);
      // Continue to next endpoint
    }
  }
 

  // Return both the book data and the successful endpoint for reference
  return { 
    data: bookData, 
    endpoint: successEndpoint 
  };
}

// Extract author information safely from the book data
function extractAuthorInfo(bookData, endpointType) {
  try {
    // Depending on which API endpoint succeeded, we need different approaches
    if (endpointType.includes('/api/books')) {
      // Format for the /api/books endpoint
      return bookData.authors?.[0]?.name || "Unknown Author";
    } else if (endpointType.includes('/api/volumes')) {
      // Format for the /api/volumes endpoint
      return bookData.authors?.[0]?.name || "Unknown Author";
    } else if (endpointType.includes('/books/')) {
      // Format for the /books/ endpoint
      return bookData.authors?.[0]?.name || "Unknown Author";
    } else {
      // Default format for /works/ endpoint
      if (bookData.authors) {
        if (Array.isArray(bookData.authors) && bookData.authors.length > 0) {
          if (bookData.authors[0].author && bookData.authors[0].author.key) {
            // Need to fetch author data from author endpoint
            return null; // Will need to fetch later
          } else if (bookData.authors[0].name) {
            return bookData.authors[0].name;
          }
        }
      }
    }
    
    return "Unknown Author";
  } catch (error) {
    console.warn("Error extracting author info:", error);
    return "Unknown Author";
  }
}

// Extract cover image URL from different API response formats
function extractCoverImage(bookData, endpointType) {
  try {
    // Different endpoints have different cover image formats
    if (endpointType.includes('/api/books')) {
      // API books endpoint
      if (bookData.cover && bookData.cover.large) {
        return bookData.cover.large;
      } else if (bookData.cover && bookData.cover.medium) {
        return bookData.cover.medium;
      }
    } else if (endpointType.includes('/api/volumes')) {
      // Volumes endpoint
      return bookData.cover?.medium || null;
    } else {
      // Works or books endpoint
      if (bookData.covers && bookData.covers.length > 0) {
        return getBookCoverUrl(bookData.covers[0], 'L');
      }
    }
    
    return null;
  } catch (error) {
    console.warn("Error extracting cover image:", error);
    return null;
  }
}

// This function is like getServerSideProps but for App Router
async function getBookData(id) {
  // Check if ID is valid before making API requests
  // if (!isValidBookId(id)) {
  //   console.error("Invalid book ID format:", id);
  //   return null;
  // }

  try {
    // Try to fetch book data from multiple endpoints
    const { data: bookData, endpoint: successEndpoint } = await tryFetchBookData(id);
    
    // Basic validation to ensure we have a book
    // if (!bookData || (bookData.error && bookData.error === 'notfound')) {
    //   console.error("Book not found in database");
    //   return null;
    // }
    
    // Extract author info based on the successful endpoint format
    let authorName = extractAuthorInfo(bookData, successEndpoint);
    
    // If we need to fetch author info separately
    if (authorName === null && bookData.authors && bookData.authors[0]?.author?.key) {
      try {
        const authorKey = bookData.authors[0].author.key;
        const authorResponse = await axios.get(`https://openlibrary.org${authorKey}.json`, { timeout: 5000 });
        authorName = authorResponse.data.name || "Unknown Author";
      } catch (authorError) {
        console.warn("Error fetching author details:", authorError);
        authorName = "Unknown Author";
      }
    }
    
    // Extract title - formats vary by endpoint
    const title = bookData.title || "Unknown Title";
    
    // Extract cover image
    const coverImage = extractCoverImage(bookData, successEndpoint);
    
    // Extract description - formats vary
    let description;
    if (typeof bookData.description === 'object' && bookData.description?.value) {
      description = bookData.description.value;
    } else if (typeof bookData.description === 'string') {
      description = bookData.description;
    } else {
      description = "No description available.";
    }
    
    // Create full book object with key
    return {
      ...bookData,
      key: `/works/${id}`,  // Ensure we have the complete key
      id: id,
      title: title,
      author: authorName,
      coverImage: coverImage,
      description: description,
      // Add data source for debugging
      _dataSource: successEndpoint
    };
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
}

// Loading UI
function BookLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/results" className="flex items-center text-blue-600 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Results
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
        <div className="md:col-span-1">
          <div className="aspect-[2/3] bg-gray-200 rounded-lg"></div>
          <div className="mt-4 h-10 bg-gray-200 rounded"></div>
        </div>
        
        <div className="md:col-span-2">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
          
          <div className="flex flex-wrap mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-6 bg-gray-200 rounded mr-2 mb-2 w-16"></div>
            ))}
          </div>
          
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function BookPage({ params }) {
  const { id } =await params;
  
  // Fetch book data
  const book = await getBookData(id);
  
  // Handle not found
  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/results" className="flex items-center text-blue-600 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Link>
        
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Book Not Found</AlertTitle>
          <AlertDescription>
            The book you're looking for couldn't be found or an error occurred while fetching the data.
            The ID "{id}" may be invalid or the book might not be in the Open Library database.
          </AlertDescription>
        </Alert>
        
        <p className="mb-6 text-gray-600">
          This could happen for several reasons:
          <ul className="list-disc pl-6 mt-2">
            <li>The book ID is incorrect</li>
            <li>The book has been removed from the Open Library database</li>
            <li>There was a temporary issue with the Open Library API</li>
          </ul>
        </p>
        
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/">Search for another book</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/popular">Browse Popular Books</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Render book details with client component for interactive elements
  // Wrapped in suspense for better loading experience
  return (
    <Suspense fallback={<BookLoading />}>
      <BookDetails book={book} />
    </Suspense>
  );
}

// This enables dynamic rendering for this page
export const dynamic = 'force-dynamic';