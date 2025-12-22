"use client";

import { Component } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

/**
 * Error Boundary component to catch and display errors gracefully
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    // Reset the error state and attempt to re-render the component
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    // Check if error occurred
    if (this.state.hasError) {
      // You can customize the fallback UI here
      return (
        <div className="rounded-md border border-red-200 p-6 my-4 bg-red-50">
          <div className="flex items-center gap-2 text-red-700 mb-4">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Something went wrong</h2>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-700">
              {this.props.fallbackMessage || "An error occurred while rendering this component."}
            </p>
            
            {process.env.NODE_ENV !== "production" && this.state.error && (
              <pre className="mt-2 text-sm bg-gray-100 p-2 rounded overflow-auto max-h-36">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button onClick={this.handleRetry}>
              Try again
            </Button>
            
            {this.props.onReset && (
              <Button variant="outline" onClick={this.props.onReset}>
                Reset
              </Button>
            )}
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}