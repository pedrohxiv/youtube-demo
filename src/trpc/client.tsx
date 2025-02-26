"use client";

import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";

import { makeQueryClient } from "@/trpc/query-client";
import type { AppRouter } from "@/trpc/routers/_app";

export const trpc = createTRPCReact<AppRouter>();

let clientQueryClientSingleton: QueryClient;

const getQueryClient = () => {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  return (clientQueryClientSingleton ??= makeQueryClient());
};

const getUrl = () => {
  const base = (() => {
    if (typeof window !== "undefined") {
      return "";
    }

    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }

    return "http://localhost:3000";
  })();

  return `${base}/api/trpc`;
};

export const TRPCProvider = (
  props: Readonly<{
    children: React.ReactNode;
  }>
) => {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: getUrl(),
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
};
