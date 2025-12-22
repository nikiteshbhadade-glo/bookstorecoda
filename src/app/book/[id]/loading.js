import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BookLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/results" className="flex items-center text-blue-600 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Results
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="aspect-[2/3] bg-gray-200 rounded-lg shadow-md animate-pulse"></div>
          <div className="mt-4 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="md:col-span-2">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-6 animate-pulse"></div>
          
          <div className="flex mb-6">
            <div className="h-6 w-16 bg-gray-200 rounded mr-2 animate-pulse"></div>
            <div className="h-6 w-16 bg-gray-200 rounded mr-2 animate-pulse"></div>
          </div>
          
          <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div>
              <div className="h-4 bg-gray-200 rounded mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}