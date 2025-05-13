"use client";

import React from "react";

type CommentProviderProps = {};

export const CommentContext = React.createContext<CommentProviderProps>({});

export function CommentProvider({ children }: { children: React.ReactNode }) {
  return (
    <CommentContext.Provider value={{}}>{children}</CommentContext.Provider>
  );
}
