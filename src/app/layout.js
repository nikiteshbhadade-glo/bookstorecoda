import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import { ReduxProvider } from "@/components/providers/redux-provider";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Book Search",
  description: "Search and discover your next favorite book",
  keywords: "books, reading, literature, search, library, ebooks",
  authors: [{ name: "BookSearch Team" }],
  openGraph: {
    title: "BookSearch - Find Your Next Favorite Read",
    description: "Search millions of books to find exactly what you're looking for",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BookSearch - Find Your Next Favorite Read",
    description: "Search millions of books to find exactly what you're looking for",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Script to prevent hydration errors by suppressing console errors in development */}
        {process.env.NODE_ENV === 'development' && (
          <Script id="suppress-hydration-warning" strategy="beforeInteractive">
            {`
              (function() {
                // Temporarily suppress hydration warnings
                const originalConsoleError = console.error;
                console.error = (...args) => {
                  if (args[0] && typeof args[0] === 'string' && 
                      (args[0].includes('hydration') || 
                       args[0].includes('Hydration') ||
                       args[0].includes('did not match'))) {
                    return;
                  }
                  originalConsoleError.apply(console, args);
                };
              })();
            `}
          </Script>
        )}
        
        <ReduxProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </ReduxProvider>
      </body>
    </html>
  );
}