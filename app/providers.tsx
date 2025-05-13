"use client";

import { Toaster } from "@/components/ui/sonner";

export const RootProviders = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
    <Toaster />
  </>
);
