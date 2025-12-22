"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function BookError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Book page error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/results" className="flex items-center text-blue-600 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Results
      </Link>
      
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription>
          An error occurred while loading this book. Please try again later.
        </AlertDescription>
      </Alert>
      
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}