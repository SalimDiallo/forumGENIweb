"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { setupZodFrench } from "@/lib/zod-fr";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Temps de fraîcheur par défaut: 5 minutes
        // Les données sont considérées "fraiches" pendant ce temps
        staleTime: 5 * 60 * 1000, // 5 minutes

        // Temps de cache: 30 minutes
        // Les données restent en cache même après être devenues "stale"
        gcTime: 30 * 60 * 1000, // 30 minutes (anciennement cacheTime)

        // Ne pas refetch automatiquement au focus
        refetchOnWindowFocus: false,

        // Ne pas refetch automatiquement à la reconnexion
        refetchOnReconnect: false,

        // Retry configuration
        retry: 1,
        retryDelay: 1000,
      },
    },
  }));

  // Initialiser Zod en français au montage du composant
  useEffect(() => {
    setupZodFrench();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

