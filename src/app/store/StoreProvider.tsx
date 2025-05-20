// src/store/StoreProvider.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "./store"; // adjust path

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
