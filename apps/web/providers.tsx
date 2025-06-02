"use client";

import { SessionProvider } from "next-auth/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ConfirmDialogProvider } from "@omit/react-confirm-dialog";

import { TRPCProvider } from "./trpc/client";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <NuqsAdapter>
      <SessionProvider>
        <TRPCProvider>
          <ConfirmDialogProvider
            defaultOptions={{
              confirmButton: {
                variant: "destructive",
              },
              cancelButton: {
                variant: "outline",
              },
            }}
          >
            {children}
          </ConfirmDialogProvider>
        </TRPCProvider>
      </SessionProvider>
    </NuqsAdapter>
  );
};
