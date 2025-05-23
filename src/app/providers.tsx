"use client";

import { Provider } from "react-redux";
import { store } from "./store/store";
import { Providers as ThemeProvider } from "@/context/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
} 