"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface AuthContextProps {
  children: React.ReactNode;
  session: Session | null;
}

export const queryClient = new QueryClient();

export default function Providers({ children, session }: AuthContextProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
