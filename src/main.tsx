import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource-variable/manrope";

import { App } from "./App";
import { AuthProvider } from "./auth/AuthProvider";
import { BookingDraftProvider } from "./booking/BookingDraftProvider";
import "./styles/app.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider><BookingDraftProvider><App /></BookingDraftProvider></AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
