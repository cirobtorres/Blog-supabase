"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { ProgressBar } from "./ProgressBar";
import { LogoutButton } from "../Buttons/client";

export const StaticHeader = ({ user }: { user: User | null }) => {
  return (
    <header className="w-full h-[var(--header-height)] border-b border-neutral-800 backdrop-blur-sm bg-neutral-950/50">
      <div className="relative max-w-7xl mx-auto h-full">
        <HeaderContent {...user} />
      </div>
    </header>
  );
};

export const FixedHeader = ({ user }: { user: User | null }) => {
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
        <HeaderContent {...user} />
      </div>
      <ProgressBar />
    </header>
  );
};

const HeaderContent = ({ id: userId }: { id?: string }) => {
  return (
    <div className="h-full mx-4 flex justify-between">
      <div className="flex items-center">
        <Link href="/">HOME</Link>
      </div>
      {userId ? (
        <div className="flex items-center gap-4">
          <Link href="/admin" className="w-fit p-1 text-sm text-theme-color">
            display_name
          </Link>
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
