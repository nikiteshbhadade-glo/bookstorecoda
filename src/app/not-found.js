import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8 text-gray-600">
        The page you are looking for does not exist or has been moved.
      </p>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        <Button asChild>
          <Link href="/">Go to Home</Link>
        </Button>
        
        <Button variant="outline" asChild>
          <Link href="/popular">Browse Popular Books</Link>
        </Button>
      </div>
    </div>
  );
}