"use client";

import { Provider } from "react-redux";
import { useRef } from "react";
import store from "../../../redux/store";

// Use consistent store instance to prevent hydration issues
export function ReduxProvider({ children }) {
  // Create a stable reference to the store
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = store;
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}