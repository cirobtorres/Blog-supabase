"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ProgressBar } from "./ProgressBar";
import { LogoutButton } from "../Buttons/client";
import Image from "next/image";

export const StaticHeader = ({ profile }: { profile: Profile | null }) => {
  return (
    <header className="w-full h-[var(--header-height)] border-b border-neutral-800 backdrop-blur-sm bg-neutral-950/50">
      <div className="relative max-w-7xl mx-auto h-full">
        <HeaderContent profile={profile} />
      </div>
    </header>
  );
};

export const FixedHeader = ({ profile }: { profile: Profile | null }) => {
  const headerRef = useRef<HTMLElement>(null);
  const scrollingDownRef = useRef(0);

  const hideNavbarListener = () => {
    let prevScrollPos = window.scrollY;
    const threshold = 1000; // Header is static for the first 1000 px on top

    const handleScroll = () => {
      const currScrollPos = window.scrollY;
      if (
        currScrollPos < threshold || // Show header when on top
        currScrollPos < prevScrollPos || // Show header when scrolling up
        (currScrollPos > prevScrollPos && scrollingDownRef.current < 1000) // Hide header after scrolling 1000 px down
      ) {
        if (headerRef.current) headerRef.current.style.top = "0"; // Show
      } else {
        if (headerRef.current) headerRef.current.style.top = "-64px"; // Hide
      }
      if (currScrollPos > prevScrollPos) {
        // scrollingDownRef.current keeps header static for a certain amout of scrolling down before hiding it
        scrollingDownRef.current += currScrollPos - prevScrollPos;
      } else {
        // It is restarted when scrolling up
        scrollingDownRef.current = 0;
      }
      prevScrollPos = currScrollPos;
    };
    return handleScroll;
  };

  useEffect(() => {
    const handleScroll = hideNavbarListener();
    window.addEventListener("scroll", handleScroll);
    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Calls only once

  return (
    <header
      ref={headerRef}
      id="floating-header"
      data-testid="floating-header"
      className="fixed top-0 [z-index:10] w-full h-[var(--header-height)] shrink-0 transition-[top] duration-300 border-b border-neutral-800 backdrop-blur-sm bg-neutral-950/50"
      style={{ top: 0 }}
    >
      <div className="relative max-w-7xl mx-auto h-full">
        <HeaderContent profile={profile} />
      </div>
      <ProgressBar />
    </header>
  );
};

const HeaderContent = ({ profile }: { profile: Profile | null }) => {
  return (
    <div className="h-full mx-4 flex justify-between">
      <div className="flex items-center">
        <Link href="/">HOME</Link>
      </div>
      {profile ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Image
              src={profile.avatar_url}
              alt={`Avatar de ${profile.username}`}
              width={24}
              height={24}
              className="rounded-full"
            />
            <Link href="/admin" className="w-fit p-1 text-sm text-theme-color">
              {profile.username}
            </Link>
          </div>
          <LogoutButton label="Sair" />
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="w-fit text-sm py-1">
            Entrar
          </Link>
          <Link href="/sign-up" className="w-fit text-sm py-1">
            Cadastrar
          </Link>
        </div>
      )}
    </div>
  );
};
