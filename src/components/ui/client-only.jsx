"use client";

import { useEffect, useState } from "react";

/**
 * ClientOnly component - Prevents hydration errors by only rendering children on the client
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render only on the client
 * @param {React.ReactNode} props.fallback - Optional fallback to show during server render
 * @returns {React.ReactNode}
 */
export function ClientOnly({ children, fallback = null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return fallback;
  }

  return children;
}