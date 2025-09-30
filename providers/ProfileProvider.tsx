"use client";

import React from "react";

type ProfileProviderProps = {
  loggedProfile: Profile | null;
};

export const ProfileContext = React.createContext<ProfileProviderProps>({
  loggedProfile: null,
});

export function ProfileProvider({
  children,
  loggedProfile,
}: {
  children: React.ReactNode;
  loggedProfile: Profile | null;
}) {
  return (
    <ProfileContext.Provider value={{ loggedProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}
