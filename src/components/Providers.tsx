"use client";

import React from "react";
import AppWalletProvider from "@/context/AppWalletProvider";
import { ArcadeSessionProvider } from "@/context/ArcadeSessionContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppWalletProvider>
      <ArcadeSessionProvider>
        {children}
      </ArcadeSessionProvider>
    </AppWalletProvider>
  );
}
