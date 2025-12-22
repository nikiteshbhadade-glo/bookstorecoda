"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

/**
 * Global error handler for the application
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global app error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 border">
        <div className="flex items-center space-x-3 text-red-600 mb-4">
          <AlertTriangle className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Something went wrong</h1>
        </div>

        <p className="text-gray-600 mb-6">
          We're sorry, but there was an error loading this page. Our team has
          been notified.
        </p>

        {process.env.NODE_ENV !== "production" && (
          <div className="mb-6">
            <p className="font-medium text-gray-700 mb-2">Error details:</p>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-40">
              {error?.message || String(error)}
            </pre>
          </div>
        )}

        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button onClick={reset} className="flex-1">
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="flex-1"
          >
            Go to homepage
          </Button>
        </div>
      </div>
    </div>
  );
}
